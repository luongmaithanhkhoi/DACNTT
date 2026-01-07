// app/student/[id]/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface StudentProfile {
  user_id: string;
  full_name: string;
  major: string;
  gpa: number | null;
  phone: string;
  location: string;
  avatar_url: string | null;
  summary?: string;
  portfolio_url?: string;
  cv_url?: string | null;
  email: string;
  skills: Array<{
    id: string;
    name: string;
    level: number;
  }>;
  applications: Array<{
    id: string;
    status: string;
    createdAt: string;
    job: {
      id: string;
      title: string;
      enterpriseName: string;
    } | null;
  }>;
}

export default function StudentProfilePage() {
  const { id } = useParams() as { id: string };
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/students/${id}`);
        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || 'Không thể tải dữ liệu');
        }

        const json = await res.json();

        if (!json.success || !json.data) {
          throw new Error(json.error || 'Dữ liệu không hợp lệ');
        }

        // ĐÚNG CẤU TRÚC: data nằm trong json.data
        const data = json.data;

        setProfile({
          user_id: data.student.user_id,
          full_name: data.student.full_name,
          major: data.student.major,
          gpa: data.student.gpa,
          phone: data.student.phone,
          location: data.student.location,
          avatar_url: data.student.avatar_url,
          summary: data.student.summary,
          portfolio_url: data.student.portfolio_url,
          cv_url: data.student.cv_url,
          email: data.student.email,
          skills: data.skills || [],
          applications: data.applications || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 fs-4">Đang tải thông tin sinh viên...</div>;
  }

  if (error || !profile) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger fs-4">{error || 'Không tìm thấy sinh viên'}</p>
        <Link href="/jobs" className="btn btn-primary fs-4 px-6 py-3 mt-4">
          Quay về trang việc làm
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="badge bg-warning px-3 py-1">Đang chờ</span>;
      case 'ACCEPTED': return <span className="badge bg-success px-3 py-1">Chấp nhận</span>;
      case 'REJECTED': return <span className="badge bg-danger px-3 py-1">Từ chối</span>;
      default: return <span className="badge bg-secondary px-3 py-1">{status}</span>;
    }
  };

  return (
    <div className="inner-content py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white rounded shadow p-5 text-center mb-5">
              <div className='d-flex justify-content-center'>
                <img
                src={profile.avatar_url || '/images/client.jpg'}
                alt={profile.full_name}
                className="rounded-circle mb-4"
                style={{ width: 180, height: 180, objectFit: 'cover' }}
              />
              </div>
              <h1 className="fs-2 fw-bold mb-3">{profile.full_name}</h1>
              <p className="fs-4 text-danger mb-4">{profile.major}</p>
              <p className="fs-5 text-muted mb-4">{profile.email}</p>

              <div className="row g-4 text-center mb-4">
                <div className="col-md-6">
                  <p><strong>GPA:</strong> {profile.gpa || 'Chưa cập nhật'}</p>
                  <p><strong>Điện thoại:</strong> {profile.phone || 'Chưa cập nhật'}</p>
                  <p><strong>Địa điểm:</strong> {profile.location || 'Chưa cập nhật'}</p>
                </div>
                <div className="col-md-6">
                  {profile.portfolio_url && (
                    <p><strong>Portfolio:</strong> <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">{profile.portfolio_url}</a></p>
                  )}
                  {profile.cv_url && (
                    <p>
                      <strong>CV:</strong>{' '}
                      <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                        Tải CV
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {profile.summary && (
                <div className="mt-4">
                  <h1 className="fs-4 fw-bold mb-3">Giới thiệu bản thân</h1>
                  <p className="fs-5 text-gray-700">{profile.summary}</p>
                </div>
              )}

              {/* KỸ NĂNG */}
              {profile.skills.length > 0 && (
                <div className="mt-5">
                  <h3 className="fs-4 fw-bold mb-3">Kỹ năng</h3>
                  <div className="row g-3">
                    {profile.skills.map(skill => (
                      <div key={skill.id} className="col-md-4">
                        <div className="bg-light p-3 rounded text-center">
                          <p className="mb-1 fw-bold">{skill.name}</p>
                          {/* <p className="text-muted small">Level {skill.level}/3</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LỊCH SỬ ỨNG TUYỂN */}
              {/* {profile.applications.length > 0 && (
                <div className="mt-5">
                  <h3 className="fs-4 fw-bold mb-3">Lịch sử ứng tuyển</h3>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Công việc</th>
                          <th>Doanh nghiệp</th>
                          <th>Trạng thái</th>
                          <th>Ngày nộp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.applications.map(app => (
                          <tr key={app.id}>
                            <td>{app.job?.title || 'Unknown'}</td>
                            <td>{app.job?.enterpriseName || 'Unknown'}</td>
                            <td>{getStatusBadge(app.status)}</td>
                            <td>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}