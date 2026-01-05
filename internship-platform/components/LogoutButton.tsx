// components/LogoutButton.tsx

"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Xác nhận trước khi logout (tùy chọn)
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Lỗi khi đăng xuất: ' + error.message);
      console.error(error);
      return;
    }

    // Xóa localStorage nếu bạn lưu thủ công (tùy chọn)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('app_user_id');
    localStorage.removeItem('enterprise_id');

    // Redirect về trang chủ hoặc login
    router.push('/login');
    router.refresh(); // Refresh để cập nhật trạng thái auth
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline-danger px-4 py-2 fs-5"
    >
      Đăng xuất
    </button>
  );
}