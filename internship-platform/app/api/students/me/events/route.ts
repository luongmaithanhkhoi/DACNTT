import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC    = process.env.SUPABASE_SERVICE_ROLE_KEY!

const toInt = (v: string | null, d=10) => {
  const n = Number(v ?? '')
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n)
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
    const limit  = toInt(searchParams.get('limit'), 10)
    const offset = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0)

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
    if (appErr || !appUser || appUser.role !== 'STUDENT' || !appUser.is_active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // lấy participation
    const { data: parts, error: pErr, count } = await admin
      .from('EventParticipation')
      .select('id, event_id, status, attendance, registered_at', { count: 'exact' })
      .eq('user_id', appUser.id)
      .order('registered_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 })

    if (!parts?.length) {
      return NextResponse.json({ total: count ?? 0, items: [], page: { limit, offset } })
    }

    // join event
    const eventIds = [...new Set(parts.map(p => p.event_id))]
    const { data: events, error: eErr } = await admin
      .from('Event')
      .select('id, title, start_date, end_date, event_type, status, location')
      .in('id', eventIds)
    if (eErr) return NextResponse.json({ error: eErr.message }, { status: 400 })

    const evMap = new Map((events ?? []).map(e => [e.id, e]))
    const items = parts.map(p => ({
      id: p.id,
      status: p.status,
      attendance: p.attendance,
      registered_at: p.registered_at,
      event: evMap.get(p.event_id) || null
    }))

    return NextResponse.json({ total: count ?? 0, items, page: { limit, offset } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}
