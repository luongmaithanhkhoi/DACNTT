import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth-supa'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const authUser = await getUserFromRequest(req)

    const { data: userRow, error } = await supabaseServer
      .from('User')
      .select('id,email,role,is_active')
      .eq('id', authUser.id)
      .single()

    if (error || !userRow) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // kèm hồ sơ SV nếu có
    const { data: student } = await supabaseServer
      .from('Student')
      .select('user_id,full_name,major,cv_url,avatar_url,graduation_year,enrollment_year')
      .eq('user_id', userRow.id)
      .maybeSingle()

    return NextResponse.json({ user: userRow, student: student ?? null }, { status: 200 })
  } catch (e: any) {
    const msg = e?.message || 'Auth error'
    const code = msg.includes('Missing Authorization') ? 401 : 400
    return NextResponse.json({ error: msg }, { status: code })
  }
}
