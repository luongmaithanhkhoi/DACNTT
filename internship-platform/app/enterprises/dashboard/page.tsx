// app/enterprise/profile/page.tsx

'use client'

import Link from 'next/link';
import { useEnterpriseProfile } from './useEnterpriseProfile';

export default function EnterpriseProfilePage() {
  const { data, loading, error } = useEnterpriseProfile();

  if (loading) {
    return <div className="text-center py-20 fs-3">Đang tải thông tin doanh nghiệp...</div>;
  }

  if (error || !data) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center fs-4">
          {error || 'Không thể tải thông tin. Vui lòng đăng nhập lại.'}
        </div>
        <div className="text-center">
          <Link href="/login" className="btn btn-primary fs-4 px-6 py-3">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  const { user, enterprise } = data;

  return (
    <div className="inner-content py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* HEADER DOANH NGHIỆP */}
            <div className="bg-white rounded shadow p-5 mb-5 text-center">
              <div className="d-flex justify-content-center">
                <img
                src={enterprise.image_url || '/images/client.jpg'}
                alt={enterprise.name}
                className="rounded-circle mb-4"
                style={{ width: 180, height: 180, objectFit: 'cover' }}
              />
              </div>
              <h1 className="fs-1 fw-bold mb-3">{enterprise.name}</h1>
              <p className="fs-4 text-muted mb-4">{enterprise.industry || 'Chưa cập nhật ngành nghề'}</p>

              <div className="d-flex justify-content-center gap-4 flex-wrap">
                {enterprise.website && (
                  <a href={enterprise.website} target="_blank" className="fs-5">
                    <i className="fa fa-globe me-2" /> Website
                  </a>
                )}
                {enterprise.contact_email && (
                  <p className="fs-5 mb-0">
                    <i className="fa fa-envelope me-2" /> {enterprise.contact_email}
                  </p>
                )}
                {enterprise.location && (
                  <p className="fs-5 mb-0">
                    <i className="fa fa-map-marker me-2" /> {enterprise.location}
                  </p>
                )}
              </div>

              <Link href="/enterprises/edit-profile" className="btn btn-danger mt-4 px-6 py-3 fs-4">
                Chỉnh sửa thông tin doanh nghiệp
              </Link>
            </div>

            {/* MÔ TẢ */}
            {enterprise.description && (
              <div className="bg-white rounded shadow p-5 mb-5">
                <h2 className="fs-3 fw-bold mb-4">Giới thiệu</h2>
                <p className="fs-5 text-gray-700">{enterprise.description}</p>
              </div>
            )}

            {/* THỐNG KÊ HOẶC TIN TUYỂN DỤNG */}
            <div className="bg-white rounded shadow p-5">
              <h2 className="fs-3 fw-bold mb-4">Quản lý</h2>
              <div className="row g-4 text-center">
                <div className="col-md-4">
                {enterprise.id ? (
                    <Link
                        href={`/enterprises/${enterprise.id}/jobs`} // ← Dùng đúng path nếu cần, hoặc /enterprise/jobs
                        className="btn btn-outline-primary w-100 py-4 fs-4"
                    >
                        <i className="fa fa-briefcase fa-2x mb-3 d-block" />
                        Quản lý tin tuyển dụng
                    </Link>
                    ) : (
                    <button className="btn btn-outline-primary w-100 py-4 fs-4" disabled>
                        Đang tải ID doanh nghiệp...
                    </button>
                    )}
                                    </div>
                <div className="col-md-4">
                  <Link href="/enterprises/applications" className="btn btn-outline-success w-100 py-4 fs-4">
                    <i className="fa fa-users fa-2x mb-3 d-block" />
                    Xem hồ sơ ứng tuyển
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/post-job" className="btn btn-danger w-100 py-4 fs-4">
                    <i className="fa fa-plus-circle fa-2x mb-3 d-block" />
                    Đăng tin mới
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}