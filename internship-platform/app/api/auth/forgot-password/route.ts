import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
    const sb = createClient(url, anon, { auth: { persistSession: false } })

    // Khi gọi, Supabase sẽ gửi link /auth/v1/verify?type=recovery&token=...
    // Link sẽ chuyển về SITE URL của bạn với hash.
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/update-password'
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
