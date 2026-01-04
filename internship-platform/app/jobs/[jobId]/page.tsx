

import { notFound } from 'next/navigation';
import Link from 'next/link';
import JobBookmarkButton from './components/JobBookmarkButton';
import JobApplyButton from './components/JobApplyButton';
interface Skill {
  id: string;
  name: string;
}

interface JobSkill {
  required_level: number;
  skill: Skill;
}
interface Category {
  id: string;
  name: string;
}

interface JobDetail {
  id: string;
  title: string;
  description: string | null;
  locationName: string | null;
  internship_period: string | null;
  require_gpa_min: number | null;
  is_open: boolean;
  application_deadline: string | null;
  allowance_min: number | null;
  allowance_max: number | null;
  category: Category | null;
  work_mode: string | null;
  job_type: string | null;
  tags: string[] | null;
  created_at: string;
  enterprise: {
    id: string;
    name: string;
    description: string | null;
    industry: string | null;
    location: string | null;
    website: string | null;
    image_url: string | null;
    contact_email: string | null;
  };
  job_skills: JobSkill[];
}

async function fetchJob(jobId: string): Promise<JobDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Không thể tải thông tin công việc');
  }

  const result = await res.json();
  if (!result.success || !result.data) {
    throw new Error('Công việc không tồn tại');
  }

  return result.data;
}

export default async function StudentJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  let job: JobDetail | null = null;

  try {
    job = await fetchJob(jobId);
  } catch (err) {
    notFound();
  }

  const formatDate = (dateString: string | null) =>
    dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'Không xác định';

  return (
    <>
      <div className="inner-heading">
        <div className="container">
          <h3>Chi tiết công việc</h3>
        </div>
      </div>

      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              {/* JOB HEADER */}
              <div className="bg-white rounded shadow-sm p-4 mb-4">
                <h2 className="text-2xl font-bold mb-3">{job.title}</h2>

                <div className="d-flex flex-wrap gap-4 fs-4 mb-3 text-muted">
                  <div>📍 {job.locationName || 'Toàn quốc'}</div>
                  <div>💼 {job.job_type || 'Toàn thời gian'}</div>
                  <div>💰 Phụ cấp: {job.allowance_min ? `${job.allowance_min.toLocaleString()} - ${job.allowance_max?.toLocaleString()} VND` : 'Thương lượng'}</div>
                  <div>⏰ Hạn nộp: {formatDate(job.application_deadline)}</div>
                </div>

                <div className="d-flex gap-3">
                  <JobApplyButton jobId={job.id} isOpen={job.is_open} />
                  {/* <button className="btn btn-danger px-5 py-2 fs-5" disabled={!job.is_open}>
                    {job.is_open ? 'Ứng tuyển ngay' : 'Đã đóng tuyển'}
                  </button> */}
                  {/* <button className="btn btn-outline-secondary px-5 py-2 fs-5">
                    ❤️ Lưu tin
                  </button> */}
                  <JobBookmarkButton jobId={job.id} />
                </div>
              </div>

              {/* MAIN CONTENT */}
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                    <h4 className="fw-bold mb-3">Chi tiết tin tuyển dụng</h4>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark fs-5 border px-3 py-2">
                          {job.category?.name || 'Frontend Developer'}
                        </span>
                      <span className="badge bg-light text-dark border px-3 py-2 fs-5">
                        {job.work_mode || 'Không xác định'}
                      </span>
                      {job.tags?.map((tag, idx) => (
                        <span key={idx} className="badge bg-light text-dark border px-3 py-2 fs-6">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                      <h4 className="fw-bold mb-3">Mô tả công việc</h4>
                      <div className="fs-5 text-dark whitespace-pre-wrap lh-lg">
                        {/* {job.description || 'Không có mô tả chi tiết'} */}
                         <div className="fs-5 text-dark whitespace-pre-wrap lh-lg ProseMirror">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: job.description || 'Không có mô tả chi tiết.',
                              }}
                            />
                          </div>
                      </div>
                    </div>

                  {job.job_skills?.length > 0 && (
                      <div className="bg-white rounded shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Kỹ năng cần có</h5>
                        <div className="d-flex flex-wrap gap-2">
                          {job.job_skills.map((js) => (
                            <span
                              key={js.skill.id}
                              className="badge fs bg-light text-danger border px-3 py-2 fs-5"
                            >
                              {js.skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="col-lg-4">
                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                    <h4 className="fw-bold mb-3">Thông tin công ty</h4>
                  
                    <ul className="list-unstyled fs-4 text-dark mb-0">
                      <li className="fw-bold">{job.enterprise?.name}</li>
                      <li>🏢 Ngành: {job.enterprise?.industry || 'Chưa cập nhật'}</li>
                      <li>📍 {job.enterprise?.location || 'Toàn quốc'}</li>
                      <li>🌐 <a href={job.enterprise?.website || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        {job.enterprise?.website || 'Chưa có website'}
                      </a></li>
                      <li>📧 {job.enterprise?.contact_email || 'Chưa có email'}</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded shadow-sm p-4">
                    <h4 className="fw-bold mb-3">Thông tin chung</h4>
                    <ul className="list-unstyled fs-4 text-dark mb-0">
                      <li>👥 Số lượng tuyển: 1</li>
                      <li>🕒 {job.job_type || 'Toàn thời gian'}</li>
                      <li>💰 Phụ cấp: {job.allowance_min ? `${job.allowance_min.toLocaleString()} VND` : 'Thương lượng'}</li>
                      {job.require_gpa_min && <li>🎓 GPA tối thiểu: {job.require_gpa_min.toFixed(1)}</li>}
                      {job.internship_period && <li>⏳ Thời gian thực tập: {job.internship_period}</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center my-5">
                <Link
                  href="/job-listing"
                  className="px-6 py-3 bg-gray-600 text-black fs-5 rounded hover:bg-gray-700 transition inline-block"
                >
                  ← Quay lại danh sách việc làm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

