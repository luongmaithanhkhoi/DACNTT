"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AppliedJob {
  id: string;
  title: string;
  company: string;
  companyImage?: string;
  location: string;
  allowance: string;
  workMode?: string;
  jobType?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  applicationDeadline?: string;
  isExpired: boolean;
}

const JOBS_PER_PAGE = 9;

export default function AppliedJobsPage() {
  const [allJobs, setAllJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const res = await fetch('/api/students/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const json = await res.json();
        setAllJobs(json.appliedJobs || []);
      }
      setLoading(false);
    };

    fetchAppliedJobs();
  }, []);

  // Lọc theo tab
  const filteredJobs = allJobs.filter(job => {
    if (filter === 'active') return !job.isExpired;
    if (filter === 'expired') return job.isExpired;
    return true;
  });

  // Phân trang
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tính số ngày còn lại
  const getDaysRemaining = (deadline?: string): string => {
    if (!deadline) return 'Không giới hạn';
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days > 0) return `Còn ${days} ngày`;
    if (days === 0) return 'Hôm nay là hạn cuối';
    return 'Đã hết hạn';
  };

  // Rút hồ sơ
  const withdrawApplication = async (jobId: string) => {
    if (!confirm('Bạn có chắc chắn muốn rút hồ sơ ứng tuyển này?')) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Vui lòng đăng nhập lại!');
      return;
    }

    setWithdrawing(jobId);

    try {
      const res = await fetch(`/api/jobs/${jobId}/applications`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setAllJobs(prev => prev.filter(j => j.id !== jobId));
        alert('Rút hồ sơ thành công!');
      } else {
        const result = await res.json();
        alert(result.error || 'Lỗi khi rút hồ sơ');
      }
    } catch (err) {
      alert('Lỗi kết nối server');
    } finally {
      setWithdrawing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge bg-warning text-dark px-3 py-1 rounded">Đang chờ</span>;
      case 'ACCEPTED':
        return <span className="badge bg-success px-3 py-1 rounded">Chấp nhận</span>;
      case 'REJECTED':
        return <span className="badge bg-danger px-3 py-1 rounded">Từ chối</span>;
      default:
        return <span className="badge bg-secondary px-3 py-1 rounded">{status}</span>;
    }
  };

  // Điều kiện hiển thị nút "Rút hồ sơ"
  const canWithdraw = (job: AppliedJob) => {
    return !job.isExpired && job.status !== 'REJECTED';
  };

  if (loading) {
    return <div className="text-center py-20 fs-4">Đang tải danh sách ứng tuyển...</div>;
  }

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h2 className="text-center mb-5 fs-2 fw-bold">
          Các công việc đã ứng tuyển ({allJobs.length})
        </h2>

        {/* TAB LỌC */}
        <div className="text-center mb-5">
          <div className="btn-group" role="group">
            <button
              className={`btn fs-5 px-5 py-2 ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              Tất cả ({allJobs.length})
            </button>
            <button
              className={`btn fs-5 px-5 py-2 ${filter === 'active' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('active')}
            >
              Còn hạn ({allJobs.filter(j => !j.isExpired).length})
            </button>
            <button
              className={`btn fs-5 px-5 py-2 ${filter === 'expired' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter('expired')}
            >
              Đã hết hạn ({allJobs.filter(j => j.isExpired).length})
            </button>
          </div>
        </div>

        {currentJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 fs-4 mb-5">
              Không có công việc nào {filter === 'active' ? 'còn hạn' : filter === 'expired' ? 'đã hết hạn' : 'trong danh sách này'}.
            </p>
            {allJobs.length === 0 && (
              <Link href="/jobs" className="btn btn-danger px-8 py-4 fs-4">
                Tìm việc ngay
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="row g-4 mb-5">
              {currentJobs.map((job) => (
                <div key={job.id} className="col-md-6 col-lg-4">
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-5 border border-gray-200 h-100 d-flex flex-column">
                    <div className="d-flex align-items-start mb-4">
                      <img
                        src={job.companyImage || '/images/client.jpg'}
                        alt={job.company}
                        className="rounded me-3"
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-bold">
                          <Link href={`/jobs/${job.id}`} className="text-primary hover:text-primary-dark">
                            {job.title}
                          </Link>
                        </h5>
                        <p className="text-gray-700 mb-0">{job.company}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">
                      Địa chỉ: {job.location}
                    </p>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2 fs-5">
                        Tình trạng: {getStatusBadge(job.status)}
                        {job.isExpired && <span className="badge bg-danger px-3 py-1 rounded ms-2">Đã hết hạn</span>}
                      </div>

                      <small className="text-muted fs-5 d-block mb-3">
                        Ngày nộp: {new Date(job.created_at).toLocaleDateString('vi-VN')}
                      </small>

                      {/* Hiển thị thời hạn còn lại */}
                      {!job.isExpired && job.applicationDeadline && (
                        <p className="text-success fw-bold mb-3">
                          {getDaysRemaining(job.applicationDeadline)}
                        </p>
                      )}

                      {/* NÚT RÚT HỒ SƠ – CHỈ HIỆN KHI CÒN HẠN VÀ KHÔNG BỊ TỪ CHỐI */}
                      {canWithdraw(job) && (
                        <button
                          onClick={() => withdrawApplication(job.id)}
                          disabled={withdrawing === job.id}
                          className="btn btn-outline-danger w-100"
                        >
                          {withdrawing === job.id ? 'Đang rút...' : 'Rút hồ sơ'}
                        </button>
                      )}

                      {/* Nếu bị từ chối hoặc hết hạn → không hiện nút rút */}
                      {job.status === 'REJECTED' && (
                        <p className="text-danger text-center mt-3 fw-bold">
                          Hồ sơ đã bị từ chối
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-5">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginate(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}