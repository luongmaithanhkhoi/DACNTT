import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ====== ENV (dùng chung) ======
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ====== Helpers ======
function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' && token ? token : null
}

async function getAuthAndAppUser(token: string) {
  // Xác thực token với Supabase Auth (anon + header Authorization)
  const authSb = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data: userRes, error: authErr } = await authSb.auth.getUser()
  if (authErr || !userRes?.user) return { error: 'Invalid token' as const }

  // Map sang user ứng dụng
  const adminSb = createClient(SUPABASE_URL, SUPABASE_SVC, { auth: { persistSession: false } })
  const { data: appUser, error: appUserErr } = await adminSb
    .from('User')
    .select('id, role, is_active, email, avatar_url')
    .eq('provider_uid', userRes.user.id)
    .single()

  if (appUserErr || !appUser) return { error: 'App user not found' as const }
  if (appUser.role !== 'STUDENT') return { error: 'Forbidden: role is not STUDENT' as const }
  if (!appUser.is_active) return { error: 'Account is inactive' as const }

  return { authUser: userRes.user, appUser, adminSb }
}

// ====== ALLOWED FIELDS cho PATCH ======
const ALLOWED_FIELDS = new Set([
  'full_name', 'major', 'gpa', 'summary', 'phone', 'location',
  'portfolio_url', 'socials', 'languages', 'cv_url',
  'enrollment_year', 'graduation_year'
])

type PatchBody = Partial<{
  full_name: string
  major: string
  gpa: number
  summary: string
  phone: string
  location: string
  portfolio_url: string
  socials: Record<string, unknown>
  languages: string[]
  cv_url: string
  enrollment_year: number
  graduation_year: number
}>

// ====== GET /api/students/me ======
export async function GET(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })

    const ctx = await getAuthAndAppUser(token)
    if ('error' in ctx) {
      const map = { 'Invalid token': 401, 'App user not found': 404, 'Forbidden: role is not STUDENT': 403, 'Account is inactive': 403 }
      return NextResponse.json({ error: ctx.error }, { status: map[ctx.error] ?? 401 })
    }
    const { appUser, adminSb } = ctx

    // Lấy hồ sơ Student
    const { data: student, error: stuErr } = await adminSb
      .from('Student')
      .select(`
        user_id, full_name, major, gpa, summary, phone, location,
        portfolio_url, socials, languages, cv_url,
        enrollment_year, graduation_year,
        created_at, updated_at
      `)
      .eq('user_id', appUser.id)
      .single()
    if (stuErr || !student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

    // Lấy skills
    const { data: skillsRows, error: skillErr } = await adminSb
      .from('StudentSkill')
      .select(`level, Skill:Skill(id, name)`)
      .eq('student_id', appUser.id)
    if (skillErr) return NextResponse.json({ error: skillErr.message }, { status: 500 })
    const skills = (skillsRows ?? []).map(r => ({ id: r.Skill?.id, name: r.Skill?.name, level: r.level }))

    // Thống kê Application
    async function countBy(status?: 'PENDING' | 'ACCEPTED' | 'REJECTED') {
      let q = adminSb.from('Application').select('id', { head: true, count: 'exact' }).eq('student_id', appUser.id)
      if (status) q = q.eq('status', status)
      const { count } = await q
      return count ?? 0
    }
    const [total, pending, accepted, rejected] = await Promise.all([countBy(), countBy('PENDING'), countBy('ACCEPTED'), countBy('REJECTED')])

    return NextResponse.json({
      profile: {
        user_id: student.user_id,
        email: appUser.email,
        avatar_url: appUser.avatar_url,
        full_name: student.full_name,
        major: student.major,
        gpa: student.gpa,
        summary: student.summary,
        phone: student.phone,
        location: student.location,
        portfolio_url: student.portfolio_url,
        socials: student.socials,
        languages: student.languages,
        cv_url: student.cv_url,
        enrollment_year: student.enrollment_year,
        graduation_year: student.graduation_year,
        created_at: student.created_at,
        updated_at: student.updated_at
      },
      skills,
      stats: { applications: total, pending, accepted, rejected }
    })
  } catch (e) {
    console.error('GET /students/me error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ====== PATCH /api/students/me (giữ nguyên logic cũ) ======
export async function PATCH(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization: Bearer <token>' }, { status: 401 })
    }

    const ctx = await getAuthAndAppUser(token)
    if ('error' in ctx) {
      const map = { 'Invalid token': 401, 'App user not found': 404, 'Forbidden: role is not STUDENT': 403, 'Account is inactive': 403 }
      return NextResponse.json({ error: ctx.error }, { status: map[ctx.error] ?? 401 })
    }
    const { appUser, adminSb } = ctx

    // Parse & validate body
    const raw: PatchBody = await req.json().catch(() => ({}))
    const update: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(raw ?? {})) {
      if (!ALLOWED_FIELDS.has(k) || v === undefined) continue
      if (k === 'languages' && v && !Array.isArray(v)) continue
      if (k === 'gpa' && v !== null && v !== undefined) {
        const num = Number(v)
        if (!Number.isNaN(num)) update[k] = num
        continue
      }
      update[k] = v
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { data: row, error: updErr } = await adminSb
      .from('Student')
      .update(update)
      .eq('user_id', appUser.id)
      .select('*')
      .single()
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 })

    return NextResponse.json({ ok: true, student: row })
  } catch (e) {
    console.error('PATCH /students/me error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
