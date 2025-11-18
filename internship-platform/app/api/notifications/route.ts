import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC    = process.env.SUPABASE_SERVICE_ROLE_KEY!

const toInt = (v: string | null, d=10) => {
  const n = Number(v ?? '')
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n)
}
const clean = (s: string | null) => {
  if (!s) return null
  const t = s.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}
const getBearer = (req: Request) => {
  const h = req.headers.get('authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function GET(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new globalThis.URL(req.url)
    const type     = clean(searchParams.get('type'))            // SYSTEM|REMINDER|APPLICATION|EVENT
    const isReadQ  = clean(searchParams.get('is_read'))         // 'true' | 'false'
    const limit    = toInt(searchParams.get('limit'), 10)
    const offset   = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0)
    const orderDir = (clean(searchParams.get('order_dir')) || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'

    // map token -> app user id
    const auth = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: u, error: uErr } = await auth.auth.getUser()
    if (uErr || !u?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })
    const { data: appUser, error: appErr } = await admin
      .from('User').select('id, role, is_active').eq('provider_uid', u.user.id).single()
    if (appErr || !appUser || !appUser.is_active) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // lấy danh sách notification cho user
    let q = admin
      .from('UserNotification')
      .select(`
        id, is_read, read_at,
        Notification:Notification(id, title, content, notification_type, created_at)
      `, { count: 'exact' })
      .eq('user_id', appUser.id)
      .order('created_at', { referencedTable: 'Notification', ascending: orderDir === 'asc' })
      .range(offset, offset + limit - 1)

    if (isReadQ === 'true')  q = q.eq('is_read', true)
    if (isReadQ === 'false') q = q.eq('is_read', false)
    if (type) q = q.eq('Notification.notification_type', type)

    const { data, error, count } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const items = (data ?? []).map((r: any) => ({
      user_notification_id: r.id,
      is_read: r.is_read,
      read_at: r.read_at,
      notification: r.Notification
    }))

    return NextResponse.json({
      total: count ?? 0,
      items,
      page: { limit, offset, order_dir: orderDir }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}
