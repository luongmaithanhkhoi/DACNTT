// lib/auth-supa.ts
import { supabaseServer } from '@/lib/supabaseServer'

export async function getUserFromRequest(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) throw new Error('Missing Authorization Bearer token')

  const { data, error } = await supabaseServer.auth.getUser(token)
  if (error || !data.user) throw new Error('Invalid or expired token')
  return data.user      // { id, email, ... } = auth.users.*
}

/** Lấy row User của app và kiểm tra role */
export async function requireRole(userId: string, roles: Array<'ADMIN'|'STUDENT'|'ENTERPRISE'>) {
  const { data, error } = await supabaseServer
    .from('User')
    .select('id, role, is_active')
    .eq('id', userId)
    .single()

  if (error || !data) throw new Error('User not found')
  if (!data.is_active) throw new Error('User is disabled')
  if (!roles.includes(data.role as any)) throw new Error('Forbidden')
  return data
}
