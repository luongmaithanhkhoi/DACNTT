// app/api/admin/create-user/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

// Kiểm tra user hiện tại có quyền admin không
async function isAdmin(token: string): Promise<boolean> {
  const authClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return false;

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('role')
    .eq('provider_uid', user.id)
    .single();

  return appUser?.role === 'ADMIN'; // hoặc kiểm tra thêm quyền enterprise admin
}

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token || !(await isAdmin(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      email,
      password,
      role, // 'STUDENT', 'ENTERPRISE'
      full_name,
      major,
      enterprise_name,
      industry,
      description,
      website,
      contact_email,
      location,
      address,
    } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    if (!['STUDENT', 'ENTERPRISE'].includes(role)) {
      return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 });
    }

    // Tạo user trong Supabase Auth bằng admin
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // tự động xác thực email
      user_metadata: { role },
    });

    if (authError || !newUser.user) {
      return NextResponse.json({ error: authError?.message || 'Không thể tạo user' }, { status: 500 });
    }

    const authUserId = newUser.user.id;

    // Tạo record trong bảng User
    const { data: appUser, error: userError } = await supabaseAdmin
      .from('User')
      .insert({
        provider_uid: authUserId,
        email: email.toLowerCase().trim(),
        role,
        is_active: true,
      })
      .select('id')
      .single();

    if (userError) {
      return NextResponse.json({ error: 'Không thể tạo hồ sơ người dùng' }, { status: 500 });
    }

    // Nếu là STUDENT, tạo record Student
    if (role === 'STUDENT') {
      const { error: studentError } = await supabaseAdmin
        .from('Student')
        .insert({
          user_id: appUser.id,
          full_name: full_name || null,
          major: major || null,
        });

      if (studentError) {
        console.error('Create Student error:', studentError);
        // Không return error – vẫn thành công
      }
    }

    // Nếu là ENTERPRISE → tạo Enterprise + EnterpriseUser
    if (role === 'ENTERPRISE') {
      if (!enterprise_name) {
        return NextResponse.json({ error: 'Tên doanh nghiệp là bắt buộc' }, { status: 400 });
      }

      const { data: enterprise, error: entError } = await supabaseAdmin
        .from('Enterprise')
        .insert({
          name: enterprise_name,
          description: description || null,
          industry: industry || null,
          website: website || null,
          contact_email: contact_email || null,
          location: location || null,
          address: address || null,
        })
        .select('id')
        .single();

      if (entError) {
        return NextResponse.json({ error: 'Không thể tạo doanh nghiệp' }, { status: 500 });
      }

      const { error: linkError } = await supabaseAdmin
        .from('EnterpriseUser')
        .insert({
          user_id: appUser.id,
          enterprise_id: enterprise.id,
          position: 'Quản trị viên',
        });

      if (linkError) {
        console.error('Link EnterpriseUser error:', linkError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Tạo tài khoản ${role.toLowerCase()} thành công!`,
      user_id: appUser.id,
    });
  } catch (err) {
    console.error('Admin create user error:', err);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}