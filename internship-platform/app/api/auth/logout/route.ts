import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function POST(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization: Bearer <token>' }, { status: 401 })
    }

    // Tạo client “theo token hiện tại”, rồi gọi signOut để revoke refresh token của phiên này
    const sb = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    const { error } = await sb.auth.signOut()
    if (error) {
      // Nếu token đã hết hạn/không hợp lệ, vẫn coi như đã đăng xuất ở client
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
