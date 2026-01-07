"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface JobApplyButtonProps {
  jobId: string;
  isOpen: boolean;
  deadline?: string | null; 
}

export default function JobApplyButton({ jobId, isOpen, deadline }: JobApplyButtonProps) {
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [canApply, setCanApply] = useState(false); 
  const [isPastDeadline, setIsPastDeadline] = useState(false); 

  useEffect(() => {
    const checkApplication = async () => {
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          console.log('No session - user not logged in');
          setHasApplied(false);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/jobs/${jobId}/applications?check=me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Cache-Control': 'no-cache'
          },
        });

        if (res.ok) {
          const result = await res.json();
          console.log('Application check result:', result);
          
          setHasApplied(result.applied === true);
          setApplicationStatus(result.status || null);
          setCanApply(result.canApply === true); 
          setIsPastDeadline(result.isPastDeadline === true); 
        } else {
          console.error('Failed to check application:', res.status);
          setHasApplied(false);
          setCanApply(false);
        }
      } catch (err) {
        console.error("Check application error:", err);
        setHasApplied(false);
      } finally {
        setLoading(false);
      }
    };

    checkApplication();
  }, [jobId]);

  const handleApply = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert('Vui lòng đăng nhập để ứng tuyển!');
      return;
    }

    setActionLoading(true);

    try {
      const res = await fetch(`/api/jobs/${jobId}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();
      console.log('Apply result:', result);

      if (res.ok) {
        setHasApplied(true);
        setApplicationStatus('PENDING');
        alert('Ứng tuyển thành công!');
      } else {
        if (result.applied) {
          setHasApplied(true);
          alert('Bạn đã ứng tuyển công việc này rồi!');
        } else {
          alert(result.error || 'Lỗi khi ứng tuyển');
        }
      }
    } catch (err) {
      console.error('Apply error:', err);
      alert('Lỗi kết nối server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm('Bạn có chắc muốn hủy ứng tuyển không?');
    if (!confirmed) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert('Vui lòng đăng nhập!');
      return;
    }

    setActionLoading(true);

    try {
      const res = await fetch(`/api/jobs/${jobId}/applications`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();
      console.log('Withdraw result:', result);

      if (res.ok) {
        setHasApplied(false);
        setApplicationStatus(null);
        alert('Đã hủy ứng tuyển thành công!');
      } else {
        alert(result.error || 'Lỗi khi hủy ứng tuyển');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      alert('Lỗi kết nối server');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <button className="btn btn-outline-secondary px-5 py-2 fs-5" disabled>
        Đang tải...
      </button>
    );
  }

  // Job closed
  if (!isOpen) {
    return (
      <button className="btn btn-secondary px-5 py-2 fs-5" disabled>
        🔒 Đã đóng tuyển
      </button>
    );
  }

  if (isPastDeadline || (deadline && new Date() > new Date(deadline))) {
    return (
      <button className="btn btn-secondary px-5 py-2 fs-5" disabled>
        Đã hết hạn ứng tuyển
      </button>
    );
  }

  if (hasApplied) {
    const getStatusInfo = () => {
      switch (applicationStatus) {
        case 'PENDING':
          return { text: 'Đã ứng tuyển (Đang chờ)', color: 'warning', icon: '' };
        case 'ACCEPTED':
          return { text: 'Đã được chấp nhận', color: 'success', icon: '' };
        case 'REJECTED':
          return { text: 'Đã bị từ chối', color: 'danger', icon: '' };
        default:
          return { text: 'Đã ứng tuyển', color: 'success', icon: '' };
      }
    };

    const statusInfo = getStatusInfo();
    const canWithdraw = applicationStatus === 'PENDING' || !applicationStatus;

    return (
      <div className="d-flex gap-2 align-items-center">
        <button 
          className={`btn btn-${statusInfo.color} px-4 py-2 fs-5`}
          disabled
        >
          {statusInfo.icon} {statusInfo.text}
        </button>
        
        {/* ✅ WITHDRAW BUTTON - Only show if PENDING */}
        {canWithdraw && (
          <button
            onClick={handleWithdraw}
            disabled={actionLoading}
            className="btn btn-outline-danger px-4 py-2 fs-5"
            title="Hủy ứng tuyển"
          >
            {actionLoading ? 'Đang xử lý...' : 'Hủy'}
          </button>
        )}
      </div>
    );
  }

  // Can apply
  return (
    <button
      onClick={handleApply}
      disabled={actionLoading}
      className="btn btn-danger px-5 py-2 fs-5"
    >
      {actionLoading ? 'Đang xử lý...' : 'Ứng tuyển ngay'}
    </button>
  );
}