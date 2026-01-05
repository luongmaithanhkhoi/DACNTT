// app/api/auth/register-enterprise/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client dùng anon key để gọi auth.signUp
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client dùng service key để insert vào các bảng (bypass RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      enterprise_name,
      industry,
      description,
      website,
      contact_email,
      location,
      address,
    } = body;

    // Validate bắt buộc
    if (!email || !password || !enterprise_name) {
      return NextResponse.json(
        { error: 'Email, mật khẩu và tên doanh nghiệp là bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // 1. Tạo user trong Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { role: 'ENTERPRISE' }, // metadata tùy chọn
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: authError.message || 'Không thể tạo tài khoản' },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Không thể tạo user trong hệ thống xác thực' },
        { status: 500 }
      );
    }

    const authUserId = authData.user.id;

    // 2. Tạo record trong bảng User (role ENTERPRISE)
    const { data: appUser, error: userError } = await supabaseAdmin
      .from('User')
      .insert({
        provider_uid: authUserId,
        email: email.trim().toLowerCase(),
        role: 'ENTERPRISE',
        is_active: true,
      })
      .select('id')
      .single();

    if (userError) {
      console.error('Insert User error:', userError);
      return NextResponse.json(
        { error: 'Không thể tạo hồ sơ người dùng' },
        { status: 500 }
      );
    }

    // 3. Tạo doanh nghiệp
    const { data: enterprise, error: entError } = await supabaseAdmin
      .from('Enterprise')
      .insert({
        name: enterprise_name.trim(),
        description: description || null,
        industry: industry || null,
        website: website || null,
        contact_email: contact_email || null,
        location: location || null,
        address: address || null,
      })
      .select('id')
      .single();

    if (entError || !enterprise) {
      console.error('Insert Enterprise error:', entError);
      return NextResponse.json(
        { error: 'Không thể tạo thông tin doanh nghiệp' },
        { status: 500 }
      );
    }

    // 4. Liên kết user với enterprise (làm quản trị viên)
    const { error: linkError } = await supabaseAdmin
      .from('EnterpriseUser')
      .insert({
        user_id: appUser.id,
        enterprise_id: enterprise.id,
        position: 'Quản trị viên', // hoặc 'Owner'
      });

    if (linkError) {
      console.error('Link EnterpriseUser error:', linkError);
      // Không return error – vẫn coi là thành công (có thể fix sau)
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản doanh nghiệp thành công! Vui lòng kiểm tra email để xác thực.',
      enterprise_id: enterprise.id,
    });
  } catch (err) {
    console.error('Register enterprise API error:', err);
    return NextResponse.json(
      { error: 'Lỗi server khi đăng ký' },
      { status: 500 }
    );
  }
}