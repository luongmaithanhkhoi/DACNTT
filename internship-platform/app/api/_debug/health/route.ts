import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const urlOk = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonOk = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const svcOk  = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  const { error } = await supabaseServer.from('User').select('id', { head: true }).limit(1)

  return NextResponse.json({
    env: { urlOk, anonOk, svcOk },
    dbOk: !error, dbError: error?.message ?? null
  })
}
