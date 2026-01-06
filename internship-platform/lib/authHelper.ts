// lib/authHelper.ts

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function getCurrentUser(token: string) {
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return { error: 'Invalid token' };

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SVC);

  const { data: appUser, error: dbError } = await adminClient
    .from('User')
    .select('id, role, is_active, email, avatar_url')
    .eq('provider_uid', user.id)
    .single();

  if (dbError || !appUser) return { error: 'App user not found' };
  if (!appUser.is_active) return { error: 'Account is inactive' };

  return { appUser, adminClient };
}

// Dành riêng cho Student
export async function getStudentUser(token: string) {
  const result = await getCurrentUser(token);
  if ('error' in result) return result;
  if (result.appUser.role !== 'STUDENT') return { error: 'Forbidden: not a student' };
  return result;
}

// Dành riêng cho Enterprise
export async function getEnterpriseUser(token: string) {
  const result = await getCurrentUser(token);
  if ('error' in result) return result;
  if (result.appUser.role !== 'ENTERPRISE') return { error: 'Forbidden: not an enterprise user' };
  return result;
}