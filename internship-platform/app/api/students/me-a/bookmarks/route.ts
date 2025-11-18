import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}
const toInt = (v: string | null, d=10) => {
  const n = Number(v ?? '')
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n)
}

export async function GET(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const limit  = toInt(searchParams.get('limit'), 10)
    const offset = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0)

    // map token -> app user id
    const authSb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${token}` } } })
    const { data: u, error: uErr } = await authSb.auth.getUser()
    if (uErr || !u?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const admin = createClient(url, svc, { auth: { persistSession: false } })
    const { data: app, error: appErr } = await admin.from('User').select('id, role, is_active').eq('provider_uid', u.user.id).single()
    if (appErr || !app || app.role !== 'STUDENT' || !app.is_active) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // lấy list bookmark + job info
    const { data, error, count } = await admin
      .from('StudentBookmark')
      .select(`
        created_at,
        JobPosting:JobPosting(
          id, title, location, is_open, application_deadline, allowance_min, work_mode,
          Enterprise:Enterprise(id, name, industry, location, image_url)
        )
      `, { count: 'exact' })
      .eq('student_id', app.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // định dạng gọn
    const items = (data ?? []).map((r: any) => ({
      saved_at: r.created_at,
      job: r.JobPosting
    }))

    return NextResponse.json({ total: count ?? 0, items, page: { limit, offset } })
  } catch (e) {
    console.error('GET /students/me/bookmarks', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
