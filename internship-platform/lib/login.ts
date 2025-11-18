import { supabase } from '@/lib/supabaseClient'

export async function loginWithEmailPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session // chứa access_token
}

export async function logout() {
  await supabase.auth.signOut()
}
