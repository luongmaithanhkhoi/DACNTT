import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

type LoginBody = { email: string; password: string }

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as LoginBody
    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
    }

    // dùng anon key để đăng nhập (đây là chuẩn của Supabase)
    const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await sb.auth.signInWithPassword({ email, password })
    if (error || !data?.session) {
      return NextResponse.json({ error: error?.message ?? 'invalid credentials' }, { status: 401 })
    }

    // Option: bạn có thể map/kiểm tra role trong bảng User nếu muốn chặn non-STUDENT ở đây.
    // Ví dụ (không bắt buộc):
    // const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
    // const { data: appUser } = await admin.from('User').select('role,is_active').eq('provider_uid', data.user.id).single()
    // if (!appUser?.is_active) return NextResponse.json({ error: 'Account inactive' }, { status: 403 })

    // Trả tối thiểu: access_token để gọi các API bảo vệ (Bearer)
    return NextResponse.json({
      token_type: 'bearer',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token, // nếu bạn muốn lưu để refresh
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
