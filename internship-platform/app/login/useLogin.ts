// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { login } from '@/lib/auth'

// export function useLogin() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const submit = async (email: string, password: string) => {
//     setLoading(true)
//     setError(null)

//     try {
//       if (!email || !password) {
//         throw new Error('Vui lòng nhập email và mật khẩu')
//       }

//       const data = await login(email, password)

//       localStorage.setItem('auth_token', data.access_token)
//       if (data.refresh_token) {
//         localStorage.setItem('refresh_token', data.refresh_token)
//       }
//       localStorage.setItem('user', JSON.stringify(data.user))

//       router.push('/profile')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return { submit, loading, error }
// }

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // ← IMPORT Ở ĐÂY

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error('Vui lòng nhập email và mật khẩu');
      }

      // DÙNG SUPABASE AUTH TRỰC TIẾP
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!data.session || !data.user) {
        throw new Error('Không nhận được thông tin đăng nhập');
      }

      // Supabase tự quản lý session, không cần localStorage thủ công
      // Nếu muốn lưu thêm user info
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/profile'); // hoặc '/student/dashboard'
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      // Xử lý lỗi phổ biến
      if (msg.includes('Invalid login credentials')) {
        setError('Email hoặc mật khẩu không đúng');
      } else if (msg.includes('Email not confirmed')) {
        setError('Email chưa được xác thực. Vui lòng kiểm tra hộp thư');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}