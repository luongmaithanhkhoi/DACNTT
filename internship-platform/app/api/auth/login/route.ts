// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email và mật khẩu phải là chuỗi' },
        { status: 400 }
      );
    }

    // Tạo client Supabase (anon key để auth)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Gọi Supabase auth signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);

      // Xử lý lỗi phổ biến
      let userMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      if (error.message.includes('Invalid login credentials')) {
        userMessage = 'Email hoặc mật khẩu không đúng';
      } else if (error.message.includes('Email not confirmed')) {
        userMessage = 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư';
      } else if (error.message.includes('Too many requests')) {
        userMessage = 'Quá nhiều lần thử. Vui lòng đợi một lát';
      }

      return NextResponse.json(
        { success: false, error: userMessage },
        { status: 401 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { success: false, error: 'Không nhận được session từ server' },
        { status: 500 }
      );
    }

    // Trả về dữ liệu cần thiết cho frontend
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          ...data.user.user_metadata,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
    });
  } catch (err) {
    console.error('Unexpected login error:', err);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}