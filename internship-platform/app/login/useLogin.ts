

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

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

      // 1. Đăng nhập với Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) throw authError;
      if (!authData.session || !authData.user) {
        throw new Error('Đăng nhập thất bại');
      }

      // 2. Lấy thông tin user từ auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không thể lấy thông tin user');

      // 3. Lấy role từ bảng User (app user)
      const { data: appUser, error: roleError } = await supabase
        .from('User')
        .select('id, role')
        .eq('provider_uid', user.id)
        .single();

      if (roleError || !appUser) {
        console.error('Lỗi lấy app user:', roleError);
        throw new Error('Không tìm thấy thông tin tài khoản trong hệ thống');
      }

      // 4. LƯU ROLE VÀO LOCALSTORAGE
      localStorage.setItem('user_role', appUser.role);
      localStorage.setItem('app_user_id', appUser.id); // Lưu ID app user (dùng cho API)

      let enterpriseId: string | null = null;

      // 5. Nếu là ENTERPRISE → lấy enterprise_id và lưu
      if (appUser.role === 'ENTERPRISE') {
        const { data: entLink, error: entError } = await supabase
          .from('EnterpriseUser')
          .select('enterprise_id')
          .eq('user_id', appUser.id)
          .maybeSingle()

        if (entError || !entLink) {
          console.error('Không tìm thấy liên kết enterprise:', entError);
          // Vẫn cho login, nhưng không có enterprise_id
        } else {
          enterpriseId = entLink.enterprise_id;
          localStorage.setItem('enterprise_id', enterpriseId);
        }
      }

      // 6. Redirect theo role
      if (appUser.role === 'STUDENT') {
        router.push('/');
      } else if (appUser.role === 'ENTERPRISE') {
        router.push('/enterprises/dashboard'); // hoặc /enterprise/profile
      } else if (appUser.role === 'ADMIN') {
        router.push('/faculty');
      }
      else {
        router.push('/');
      }

      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
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