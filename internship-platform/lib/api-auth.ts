import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function getStudentAppUserFromToken(token: string) {
  const authSb = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data: userRes, error: authErr } = await authSb.auth.getUser()
  if (authErr || !userRes?.user) throw new Error('AUTH_INVALID')

  const admin = createClient(url, svc, { auth: { persistSession: false } })
  const { data: appUser, error: appUserErr } = await admin
    .from('User')
    .select('id, role, is_active')
    .eq('provider_uid', userRes.user.id)
    .single()

  if (appUserErr || !appUser) throw new Error('APP_USER_NOT_FOUND')
  if (appUser.role !== 'STUDENT') throw new Error('FORBIDDEN_ROLE')
  if (!appUser.is_active) throw new Error('INACTIVE')
  return { admin, appUser } // admin=supabase service client, appUser.id dùng làm folder
}
