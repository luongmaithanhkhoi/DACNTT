import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC    = process.env.SUPABASE_SERVICE_ROLE_KEY!

const getBearer = (req: Request) => {
  const h = req.headers.get('authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}
const goodId = (s?: string) => {
  if (!s) return null
  const t = s.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}

export async function POST(req: Request, ctx: { params: { id?: string } }) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = goodId(ctx.params?.id)
    if (!id) return NextResponse.json({ error: 'Invalid notification id' }, { status: 400 })

    const auth = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: u, error: uErr } = await auth.auth.getUser()
    if (uErr || !u?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })
    const { data: appUser, error: appErr } = await admin
      .from('User').select('id, is_active').eq('provider_uid', u.user.id).single()
    if (appErr || !appUser || !appUser.is_active) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // chỉ cập nhật dòng thuộc user hiện tại
    const { error } = await admin
      .from('UserNotification')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', appUser.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}
