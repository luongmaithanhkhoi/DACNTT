import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!h) return null
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function DELETE(req: Request, ctx: { params?: Record<string,string> }) {
  try {
      const fromUrl = () => {
            const parts = new URL(req.url).pathname.split('/').filter(Boolean)
            return parts[parts.length - 1] || null
          }
        
          const p = ctx?.params ?? {}
          const skillId =
            p.skillId ?? p.skillID ?? p.id ?? fromUrl()
        
          if (!skillId) {
            return NextResponse.json({ error: 'skillId required' }, { status: 400 })
          }

    // 1) Verify token
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })
    const authSb = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: ures, error: authErr } = await authSb.auth.getUser()
    if (authErr || !ures?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // 2) Map sang app User
    const admin = createClient(url, svc, { auth: { persistSession: false } })
    const { data: appUser, error: appErr } = await admin
      .from('User')
      .select('id, role, is_active')
      .eq('provider_uid', ures.user.id)
      .single()
    if (appErr || !appUser) return NextResponse.json({ error: 'App user not found' }, { status: 404 })
    if (appUser.role !== 'STUDENT') return NextResponse.json({ error: 'Forbidden (not STUDENT)' }, { status: 403 })
    if (!appUser.is_active) return NextResponse.json({ error: 'Account inactive' }, { status: 403 })

    // 3) Xoá skill
    const { error: delErr } = await admin
      .from('StudentSkill')
      .delete()
      .eq('student_id', appUser.id)
      .eq('skill_id', skillId)

    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('DELETE /students/me/skills/:skillId error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
