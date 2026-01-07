

"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface JobBookmarkButtonProps {
  jobId: string;
}

export default function JobBookmarkButton({ jobId }: JobBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);        // loading khi check trạng thái
  const [actionLoading, setActionLoading] = useState(false); // loading khi lưu/bỏ lưu

  // BƯỚC QUAN TRỌNG: KIỂM TRA TRẠNG THÁI BOOKMARK KHI LOAD TRANG
  useEffect(() => {
    const check = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/jobs/${jobId}/bookmark`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const result = await res.json();
          setIsBookmarked(result.success === true);
        }
      } catch (err) {
        console.error("Check bookmark error:", err);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [jobId]);

  const toggle = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Vui lòng đăng nhập để lưu tin!");
      return;
    }

    setActionLoading(true);

    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/jobs/${jobId}/bookmark`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
        alert(isBookmarked ? "Đã bỏ lưu tin" : "Đã lưu tin thành công!");
      } else {
        const result = await res.json();
        alert(result.error || "Lỗi khi lưu tin");
      }
    } catch (err) {
      alert("Lỗi kết nối server");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <button className="btn btn-outline-secondary px-5 py-2 fs-5" disabled>Đang tải...</button>;
  }

  return (
    <button
      onClick={toggle}
      disabled={actionLoading}
      className={`btn px-5 py-2 fs-5 ${isBookmarked ? 'btn-success' : 'btn-outline-secondary'}`}
    >
      {actionLoading ? 'Đang xử lý...' : isBookmarked ? 'Đã lưu' : '❤️ Lưu tin'}
    </button>
  );
}