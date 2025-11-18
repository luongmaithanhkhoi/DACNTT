import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC    = process.env.SUPABASE_SERVICE_ROLE_KEY!

const goodId = (id?: string) => {
  if (!id) return null
  const t = id.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}
const getBearer = (req: Request) => {
  const h = req.headers.get('authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}
async function getStudentIdFromToken(token: string) {
  const auth = createClient(SB_URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data: u, error } = await auth.auth.getUser()
  if (error || !u?.user) return null

  const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })
  const { data: appUser, error: appErr } = await admin
    .from('User').select('id, role, is_active').eq('provider_uid', u.user.id).single()
  if (appErr || !appUser || appUser.role !== 'STUDENT' || !appUser.is_active) return null
  return appUser.id as string
}

export async function POST(req: Request, ctx: { params: Promise<{ id?: string }> } ) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: rawId } = await ctx.params
    const eventId = goodId(rawId)
    if (!eventId) return NextResponse.json({ error: 'Invalid event id' }, { status: 400 })

    const studentId = await getStudentIdFromToken(token)
    if (!studentId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })

    // 1) kiểm tra event
    const { data: ev, error: evErr } = await admin
      .from('Event')
      .select('id, status, max_participants')
      .eq('id', eventId)
      .single()
    if (evErr || !ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    if (ev.status !== 'PUBLISHED') return NextResponse.json({ error: 'Event is not open' }, { status: 400 })

    // 2) kiểm tra trùng & sức chứa
    const { data: exist, error: exErr } = await admin
      .from('EventParticipation')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', studentId)
      .maybeSingle()
    if (exErr) return NextResponse.json({ error: exErr.message }, { status: 400 })
    if (exist) return NextResponse.json({ error: 'Already registered' }, { status: 409 })

    if (ev.max_participants && ev.max_participants > 0) {
      const { count } = await admin
        .from('EventParticipation')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
      if ((count ?? 0) >= ev.max_participants) {
        return NextResponse.json({ error: 'Event is full' }, { status: 400 })
      }
    }

    // 3) tạo participation
    const { data: row, error: insErr } = await admin
      .from('EventParticipation')
      .insert({
        event_id: eventId,
        user_id: studentId,
        role: 'ATTENDEE',
        status: 'REGISTERED',
        attendance: null
      })
      .select('id, registered_at')
      .single()
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 })

    return NextResponse.json({ ok: true, id: row.id, registered_at: row.registered_at })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: { params: { id?: string } }) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const eventId = goodId(ctx.params?.id)
    if (!eventId) return NextResponse.json({ error: 'Invalid event id' }, { status: 400 })

    const studentId = await getStudentIdFromToken(token)
    if (!studentId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })

    const { error } = await admin
      .from('EventParticipation')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', studentId)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, unregistered: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}
