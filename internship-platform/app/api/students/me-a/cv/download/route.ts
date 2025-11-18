import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getBearer, getStudentAppUserFromToken } from '@/lib/api-auth'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BUCKET = 'documents'

export async function POST(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })
    const { admin, appUser } = await getStudentAppUserFromToken(token)
    const { path, expiresIn } = await req.json() as { path: string; expiresIn?: number }

    if (!path || !path.startsWith(`${appUser.id}/`)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const { data, error } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(path, expiresIn ?? 60) // 60s
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ signed_url: data.signedUrl })
  } catch (e: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
