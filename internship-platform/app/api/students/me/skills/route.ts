import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!

type SkillItem = { skill_id: string; level?: number }
type Body = { skills: SkillItem[] }

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!h) return null
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function PUT(req: Request) {
  try {
    // 1) Lấy & verify token
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })
    const authSb = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: ures, error: authErr } = await authSb.auth.getUser()
    if (authErr || !ures?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // 2) Map sang bảng ứng dụng User
    const admin = createClient(url, svc, { auth: { persistSession: false } })
    const { data: appUser, error: appErr } = await admin
      .from('User')
      .select('id, role, is_active')
      .eq('provider_uid', ures.user.id)
      .single()
    if (appErr || !appUser) return NextResponse.json({ error: 'App user not found' }, { status: 404 })
    if (appUser.role !== 'STUDENT') return NextResponse.json({ error: 'Forbidden (not STUDENT)' }, { status: 403 })
    if (!appUser.is_active) return NextResponse.json({ error: 'Account inactive' }, { status: 403 })

    // 3) Parse body & validate
    const body = (await req.json().catch(() => ({}))) as Body
    if (!Array.isArray(body.skills) || body.skills.length === 0) {
      return NextResponse.json({ error: 'skills[] required' }, { status: 400 })
    }
    // Làm sạch & unique theo skill_id
    const seen = new Set<string>()
    const rows = []
    for (const item of body.skills) {
      if (!item?.skill_id || typeof item.skill_id !== 'string') continue
      if (seen.has(item.skill_id)) continue
      seen.add(item.skill_id)
      rows.push({
        student_id: appUser.id,     // tương thích cả 2 kiểu FK (Student.user_id hay User.id)
        skill_id: item.skill_id,
        level: Number.isFinite(item.level as number) ? (item.level as number) : 3
      })
    }
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid skills' }, { status: 400 })
    }

    // 4) (Tuỳ chọn) kiểm tra skill_id có tồn tại
    // Bỏ qua cho nhanh. Nếu muốn bật, dùng đoạn dưới:
    // const ids = rows.map(r => r.skill_id)
    // const { data: exists } = await admin.from('Skill').select('id').in('id', ids)
    // if (!exists || exists.length !== ids.length) return NextResponse.json({ error: 'Unknown skill_id' }, { status: 400 })

    // 5) Upsert
    const { data, error } = await admin
      .from('StudentSkill')
      .upsert(rows, { onConflict: 'student_id,skill_id' })
      .select(`
        student_id,
        level,
        Skill:Skill(id,name)
      `)
      .eq('student_id', appUser.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, skills: data?.map(s => ({
      id: s.Skill?.id, name: s.Skill?.name, level: s.level
    })) ?? [] })
  } catch (e: any) {
    console.error('PUT /students/me/skills error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
