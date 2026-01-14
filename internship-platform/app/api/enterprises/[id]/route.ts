import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Tạo client admin (service role key) 
const adminSb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

    // Xác thực user từ token
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Lấy app user
    const { data: appUser } = await adminSb
      .from('User')
      .select('id')
      .eq('provider_uid', user.id)
      .single();

    if (!appUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Lấy enterprise_id từ EnterpriseUser
    const { data: entLink, error: linkError } = await adminSb
      .from('EnterpriseUser')
      .select('enterprise_id')
      .eq('user_id', appUser.id)
      .single();

    if (linkError || !entLink) {
      return NextResponse.json({ error: 'Enterprise not linked' }, { status: 404 });
    }
    const { id } = await params;
    if (entLink.enterprise_id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Lấy thông tin enterprise
    const { data: enterprise, error: entError } = await adminSb
      .from('Enterprise')
      .select('*')
      .eq('id', params.id)
      .single();

    if (entError || !enterprise) {
      return NextResponse.json({ error: 'Enterprise not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
    console.error('GET enterprise error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}