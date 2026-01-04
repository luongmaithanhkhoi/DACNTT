// // components/JobApplyButton.tsx

// "use client";

// import { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function JobApplyButton({ jobId, isOpen }: { jobId: string; isOpen: boolean }) {
//   const [hasApplied, setHasApplied] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   useEffect(() => {
//     const check = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         setLoading(false);
//         return;
//       }

//       // Bạn có thể thêm API GET check application tương tự bookmark nếu cần
//       // Hoặc để trống, chỉ dựa vào hành động apply
//       setLoading(false);
//     };
//     check();
//   }, [jobId]);

//   const apply = async () => {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) {
//       alert('Vui lòng đăng nhập để ứng tuyển!');
//       return;
//     }

//     setActionLoading(true);
//     const res = await fetch(`/api/jobs/${jobId}/applications`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${session.access_token}`,
//       },
//     });

//     const result = await res.json();
//     if (res.ok) {
//       setHasApplied(true);
//       alert('Ứng tuyển thành công!');
//     } else {
//       alert(result.error || 'Lỗi khi ứng tuyển');
//     }
//     setActionLoading(false);
//   };

//   if (!isOpen) {
//     return <button className="btn btn-secondary px-5 py-2 fs-5" disabled>Đã đóng tuyển</button>;
//   }

//   return (
//     <button
//       onClick={apply}
//       disabled={actionLoading || hasApplied}
//       className={`btn px-5 py-2 fs-5 ${hasApplied ? 'btn-success' : 'btn-danger'}`}
//     >
//       {actionLoading ? 'Đang xử lý...' : hasApplied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
//     </button>
//   );
// }
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
}

export default function JobApplyButton({ jobId, isOpen }: JobApplyButtonProps) {
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ CHECK APPLICATION STATUS ON LOAD
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

        // ✅ THÊM ?check=me để phân biệt với employer list view
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
        } else {
          console.error('Failed to check application:', res.status);
          setHasApplied(false);
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
        // Handle "already applied" case
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
        Đã đóng tuyển
      </button>
    );
  }

  // Already applied
  if (hasApplied) {
    const statusText = applicationStatus === 'PENDING' 
      ? 'Đã ứng tuyển' 
      : applicationStatus === 'ACCEPTED'
      ? 'Đã được chấp nhận'
      : applicationStatus === 'REJECTED'
      ? 'Đã bị từ chối'
      : 'Đã ứng tuyển';

    return (
      <button 
        className="btn btn-success px-5 py-2 fs-5" 
        disabled
      >
        {statusText}
      </button>
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