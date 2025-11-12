import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY!

type PrefBody = Partial<{
  locations: string[]
  industries: string[]
  preferred_skills: string[]      // uuid[]
  work_modes: ('ONSITE'|'HYBRID'|'REMOTE')[]
  min_allowance: number
  exclude_keywords: string[]
}>

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

async function getAppUserIdFromToken(token: string) {
  // Lấy auth user
  const authSb = createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data: userRes, error: authErr } = await authSb.auth.getUser()
  if (authErr || !userRes?.user) return { error: 'Invalid token' as const }

  // Map sang bảng ứng dụng "User" qua provider_uid
  const admin = createClient(URL, SVC, { auth: { persistSession: false } })
  const { data: appUser, error: appUserErr } = await admin
    .from('User')
    .select('id, role, is_active')
    .eq('provider_uid', userRes.user.id)
    .single()

  if (appUserErr || !appUser) return { error: 'App user not found' as const }
  if (appUser.role !== 'STUDENT') return { error: 'Forbidden: role is not STUDENT' as const }
  if (!appUser.is_active) return { error: 'Account is inactive' as const }
  return { userId: appUser.id }
}

// GET /api/students/me/preferences  -> lấy preferences hiện tại
export async function GET(req: Request) {
  const token = getBearer(req)
  if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })

  const idRes = await getAppUserIdFromToken(token)
  if ('error' in idRes) return NextResponse.json({ error: idRes.error }, { status: 401 })
  const studentId = idRes.userId

  const admin = createClient(URL, SVC, { auth: { persistSession: false } })
  const { data, error } = await admin
    .from('StudentPreference')
    .select('*')
    .eq('student_id', studentId)
    .single()

  if (error && error.code !== 'PGRST116') { // not found code may vary; ignore if not exists
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ preferences: data ?? null })
}

// PUT /api/students/me/preferences  -> upsert (replace fields sent)
export async function PUT(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })

    const idRes = await getAppUserIdFromToken(token)
    if ('error' in idRes) return NextResponse.json({ error: idRes.error }, { status: 401 })
    const studentId = idRes.userId

    const raw: PrefBody = await req.json().catch(() => ({}))
    // Validate nhẹ
    const payload: Record<string, any> = { student_id: studentId }
    if (raw.locations !== undefined) {
      if (!Array.isArray(raw.locations)) return NextResponse.json({ error: 'locations must be array' }, { status: 400 })
      payload.locations = raw.locations
    }
    if (raw.industries !== undefined) {
      if (!Array.isArray(raw.industries)) return NextResponse.json({ error: 'industries must be array' }, { status: 400 })
      payload.industries = raw.industries
    }
    if (raw.preferred_skills !== undefined) {
      if (!Array.isArray(raw.preferred_skills)) return NextResponse.json({ error: 'preferred_skills must be array' }, { status: 400 })
      payload.preferred_skills = raw.preferred_skills
    }
    if (raw.work_modes !== undefined) {
      if (!Array.isArray(raw.work_modes)) return NextResponse.json({ error: 'work_modes must be array' }, { status: 400 })
      // Optional: kiểm tra enum
      const ok = raw.work_modes.every(w => ['ONSITE','HYBRID','REMOTE'].includes(w as any))
      if (!ok) return NextResponse.json({ error: 'work_modes invalid' }, { status: 400 })
      payload.work_modes = raw.work_modes
    }
    if (raw.min_allowance !== undefined) {
      const n = Number(raw.min_allowance)
      if (Number.isNaN(n) || n < 0) return NextResponse.json({ error: 'min_allowance invalid' }, { status: 400 })
      payload.min_allowance = Math.trunc(n)
    }
    if (raw.exclude_keywords !== undefined) {
      if (!Array.isArray(raw.exclude_keywords)) return NextResponse.json({ error: 'exclude_keywords must be array' }, { status: 400 })
      payload.exclude_keywords = raw.exclude_keywords
    }

    // Upsert (replace): nếu có thì update, chưa có thì insert
    const admin = createClient(URL, SVC, { auth: { persistSession: false } })
    const { data, error } = await admin
      .from('StudentPreference')
      .upsert(payload, { onConflict: 'student_id' })
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, preferences: data })
  } catch (e: any) {
    console.error('PUT /students/me/preferences', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
