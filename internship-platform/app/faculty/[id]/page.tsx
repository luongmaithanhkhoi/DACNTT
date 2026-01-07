// app/enterprise/[enterpriseId]/page.tsx

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Enterprise {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  image_url: string | null;
  website: string | null;
  contact_email: string | null;
  location: string | null;
  address: string | null;
}

interface Job {
  id: string;
  title: string;
  allowance: string;
  workMode?: string;
  jobType?: string;
  deadline?: string;
  location: string;
}

interface EnterpriseProfileData {
  enterprise: Enterprise;
  jobs: Job[];
  stats: {
    totalJobs: number;
    totalApplications: number;
  };
}

export default function EnterpriseProfilePage({ params }: { params: { enterpriseId: string } }) {
  const { enterpriseId } = params;

  const [data, setData] = useState<EnterpriseProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/enterprises/${enterpriseId}`);
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error('Không thể tải thông tin doanh nghiệp');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [enterpriseId]);

  if (loading) {
    return <div className="text-center py-20 fs-4">Đang tải thông tin doanh nghiệp...</div>;
  }

  if (!data) {
    notFound();
  }

  const { enterprise, jobs, stats } = data;

  return (
    <div className="inner-content py-5">
      <div className="container">
        {/* HEADER DOANH NGHIỆP */}
        <div className="row align-items-center mb-5 bg-white rounded shadow p-5">
          <div className="col-md-3 text-center">
            <img
              src={enterprise.image_url || '/images/client.jpg'}
              alt={enterprise.name}
              className="rounded"
              style={{ width: 180, height: 180, objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-9">
            <h1 className="fs-1 fw-bold mb-3">{enterprise.name}</h1>
            <p className="fs-4 text-muted mb-3">{enterprise.industry || 'Chưa cập nhật ngành nghề'}</p>
            <p className="fs-5">{enterprise.description || 'Chưa có mô tả doanh nghiệp.'}</p>

            <div className="mt-4">
              {enterprise.location && <p><i className="fa fa-map-marker me-2" /> {enterprise.location}</p>}
              {enterprise.address && <p><i className="fa fa-home me-2" /> {enterprise.address}</p>}
              {enterprise.website && <p><i className="fa fa-globe me-2" /> <a href={enterprise.website} target="_blank">{enterprise.website}</a></p>}
              {enterprise.contact_email && <p><i className="fa fa-envelope me-2" /> {enterprise.contact_email}</p>}
            </div>

            {/* Thống kê */}
            <div className="mt-4">
              <span className="badge bg-primary fs-5 me-3">Đang tuyển: {stats.totalJobs} vị trí</span>
            </div>
          </div>
        </div>

        {/* DANH SÁCH TIN TUYỂN DỤNG */}
        <h2 className="text-center mb-5 fs-2">Tin tuyển dụng đang mở</h2>

        {jobs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 fs-4">Doanh nghiệp này hiện chưa có tin tuyển dụng nào đang mở.</p>
          </div>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <div className="bg-white rounded shadow hover:shadow-lg transition p-4 border">
                  <h4 className="fw-bold mb-3">
                    <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
                      {job.title}
                    </Link>
                  </h4>
                  <p className="text-gray-700 mb-2">💰 {job.allowance}</p>
                  <p className="text-gray-600 mb-2">📍 {job.location}</p>
                  {job.deadline && (
                    <p className="text-muted small">
                      Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}