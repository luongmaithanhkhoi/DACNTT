// app/api/enterprises/me/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

async function getEnterpriseUser(token: string) {
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return { error: 'Invalid token' };

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SVC);

  const { data: appUser, error: dbError } = await adminClient
    .from('User')
    .select('id, role, email')
    .eq('provider_uid', user.id)
    .single();

  if (dbError || !appUser) return { error: 'User not found' };
  if (appUser.role !== 'ENTERPRISE') return { error: 'Forbidden: not enterprise' };

  // Lấy enterprise_id từ EnterpriseUser
  const { data: entUser, error: entError } = await adminClient
    .from('EnterpriseUser')
    .select('enterprise_id')
    .eq('user_id', appUser.id)
    .single();

  if (entError || !entUser) return { error: 'Enterprise link not found' };

  // Lấy thông tin doanh nghiệp
  const { data: enterprise, error: entDetailError } = await adminClient
    .from('Enterprise')
    .select('*')
    .eq('id', entUser.enterprise_id)
    .single();

  if (entDetailError || !enterprise) return { error: 'Enterprise not found' };

  return { appUser, enterprise, adminClient };
}

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

    const result = await getEnterpriseUser(token);
    if ('error' in result) {
        console.log(result.error)
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    const { appUser, enterprise } = result;

    return NextResponse.json({
      user: {
        id: appUser.id,
        email: appUser.email,
        role: 'ENTERPRISE',
      },
      enterprise: {
        id: enterprise.id,
        name: enterprise.name,
        description: enterprise.description,
        industry: enterprise.industry,
        image_url: enterprise.image_url,
        website: enterprise.website,
        contact_email: enterprise.contact_email,
        location: enterprise.location,
        address: enterprise.address,
      },
    });
  } catch (err) {
    console.error('GET enterprises/me error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}