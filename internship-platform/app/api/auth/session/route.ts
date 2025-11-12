// app/api/auth/session/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function GET(req: Request) {
  const token = getBearer(req)
  if (!token) return NextResponse.json({ error: 'no token' }, { status: 401 })
  const sb = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data, error } = await sb.auth.getUser()
  if (error) return NextResponse.json({ error: error.message }, { status: 401 })
  return NextResponse.json({ user: data.user })
}
