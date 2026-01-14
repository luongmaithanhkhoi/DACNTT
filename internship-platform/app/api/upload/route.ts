// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! //  Service key bypass RLS
);

// Helper: Get user from token
async function getUserFromToken(token: string) {
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false }
    }
  );

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('id, role, is_active')
    .eq('provider_uid', user.id)
    .single();

  return appUser;
}

// Get enterprise_id for ENTERPRISE role
async function getEnterpriseId(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('EnterpriseUser')
    .select('enterprise_id')
    .eq('user_id', userId)
    .single();

  return data?.enterprise_id || null;
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appUser = await getUserFromToken(token);
    if (!appUser || !appUser.is_active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'avatar' | 'cv' | 'logo'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if ((fileType === 'avatar' || fileType === 'logo') && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (fileType === 'cv' && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'CV must be a PDF' }, { status: 400 });
    }

    // Determine bucket and folder based on role and type
    let bucket: string;
    let folder: string;

    if (appUser.role === 'STUDENT') {
      if (fileType === 'avatar') {
        bucket = 'avatars';
        folder = appUser.id;
      } else if (fileType === 'cv') {
        bucket = 'cvs';
        folder = appUser.id;
      } else {
        return NextResponse.json({ error: 'Invalid file type for student' }, { status: 400 });
      }
    } else if (appUser.role === 'ENTERPRISE') {
      if (fileType === 'logo') {
        const enterpriseId = await getEnterpriseId(appUser.id);
        if (!enterpriseId) {
          return NextResponse.json({ error: 'Enterprise not found' }, { status: 404 });
        }
        bucket = 'enterprise-logos';
        folder = enterpriseId;
      } else {
        return NextResponse.json({ error: 'Invalid file type for enterprise' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported role' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    // Upload with Service Role (bypass RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('File uploaded successfully:', { 
      userId: appUser.id, 
      role: appUser.role,
      type: fileType,
      url: publicUrl 
    });

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName 
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}