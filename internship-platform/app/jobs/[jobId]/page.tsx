// // app/jobs/[jobId]/page.tsx

// import { notFound } from 'next/navigation';
// import Link from 'next/link';

// interface Enterprise {
//   id: string;
//   name: string;
//   description: string | null;
//   industry: string | null;
//   location: string | null;
//   website: string | null;
//   image_url: string | null;
//   contact_email: string | null;
// }

// interface Skill {
//   id: string;
//   name: string;
// }

// interface JobSkill {
//   skill_id: string;
//   required_level: number;
//   Skill: Skill;
// }

// interface JobDetail {
//   id: string;
//   title: string;
//   description: string | null;
//   location: string | null;
//   internship_period: string | null;
//   require_gpa_min: number | null;
//   is_open: boolean;
//   application_deadline: string | null;
//   allowance_min: number | null;
//   allowance_max: number | null;
//   work_mode: string | null;
//   employment_type: string | null;
//   tags: string[] | null;
//   created_at: string;
//   updated_at: string;
//   Enterprise: Enterprise;
//   JobSkill: JobSkill[];
// }

// async function fetchJob(jobId: string): Promise<JobDetail> {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//   const apiUrl = `${baseUrl}/api/jobs/${jobId}`;

//   const res = await fetch(apiUrl, {
//     cache: 'no-store',
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Không thể tải công việc: ${res.status} ${text}`);
//   }

//   const result = await res.json();

//   if (!result.item) {
//     throw new Error('Công việc không tồn tại hoặc đã bị đóng');
//   }

//   return result.item as JobDetail;
// }

// export default async function StudentJobDetailPage({
//   params,
// }: {
//   params: Promise<{ jobId: string }>;
// }) {
//   const { jobId } = await params;

//   let job: JobDetail | null = null;
//   let errorMessage: string | null = null;

//   try {
//     job = await fetchJob(jobId);
//   } catch (err) {
//     errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải thông tin công việc';
//   }

//   if (!job) {
//     notFound();
//   }

//   const formatDate = (dateString: string | null) =>
//     dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'Không xác định';

//   return (
//     <>
//       <div className="inner-heading">
//         <div className="container">
//           <h3>Chi tiết công việc</h3>
//         </div>
//       </div>

//       <div className="inner-content loginWrp">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-12">
//               {errorMessage && (
//                 <div className="alert alert-danger text-center">
//                   {errorMessage}
//                 </div>
//               )}

//               {job && (
//                 <>
//                   {/* ===== JOB HEADER ===== */}
//                   <div className="bg-white rounded shadow-sm p-4 mb-4">
//                     <h2 className="text-2xl font-bold mb-3">{job.title}</h2>

//                     <div className="d-flex flex-wrap gap-4 fs-5 mb-3 text-muted">
//                       <div>📍 {job.location || 'Toàn quốc'}</div>
//                       <div>💼 {job.employment_type || job.job_type || 'Toàn thời gian'}</div>
//                       <div>💰 Phụ cấp: {job.allowance_min ? `${job.allowance_min.toLocaleString()} - ${job.allowance_max?.toLocaleString()} VND` : 'Thương lượng'}</div>
//                       <div>⏰ Hạn nộp: {formatDate(job.application_deadline)}</div>
//                       <div>
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           job.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                         }`}>
//                           {job.is_open ? 'Đang tuyển' : 'Đã đóng'}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Nút hành động cho sinh viên */}
//                     <div className="d-flex gap-3">
//                       <button className="btn btn-danger px-5 py-2 fs-5" disabled={!job.is_open}>
//                         {job.is_open ? 'Ứng tuyển ngay' : 'Đã đóng tuyển'}
//                       </button>
//                       <button className="btn btn-outline-secondary px-5 py-2 fs-5">
//                         ❤️ Lưu tin
//                       </button>
//                     </div>
//                   </div>

//                   {/* ===== MAIN CONTENT ===== */}
//                   <div className="row g-4">
//                     {/* LEFT COLUMN */}
//                     <div className="col-lg-8">
//                       <div className="bg-white rounded shadow-sm p-4 mb-4">
//                         <h5 className="fw-bold mb-3">Chi tiết tin tuyển dụng</h5>
//                         <div className="d-flex flex-wrap gap-2">
//                           <span className="badge bg-light text-dark border px-3 py-2 fs-6">
//                             {job.work_mode || 'Không xác định'}
//                           </span>
//                           {job.tags && job.tags.map((tag, idx) => (
//                             <span key={idx} className="badge bg-light text-dark border px-3 py-2 fs-6">
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="bg-white rounded shadow-sm p-4 mb-4">
//                         <h5 className="fw-bold mb-3">Mô tả công việc</h5>
//                         <div className="fs-5 text-dark whitespace-pre-wrap lh-lg">
//                           {job.description || 'Không có mô tả chi tiết.'}
//                         </div>
//                       </div>

//                       {job.JobSkill && job.JobSkill.length > 0 && (
//                         <div className="bg-white rounded shadow-sm p-4">
//                           <h5 className="fw-bold mb-3">Kỹ năng yêu cầu</h5>
//                           <div className="d-flex flex-wrap gap-2">
//                             {job.JobSkill.map((js) => (
//                               <span
//                                 key={js.skill_id}
//                                 className="badge bg-primary-subtle text-primary border px-3 py-2 fs-6"
//                               >
//                                 {js.Skill.name} (Level {js.required_level}/5)
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* RIGHT COLUMN */}
//                     <div className="col-lg-4">
//                       <div className="bg-white rounded shadow-sm p-4 mb-4">
//                         <h5 className="fw-bold mb-3">Thông tin công ty</h5>
//                         <div className="text-center mb-4">
//                           <img
//                             src={job.Enterprise.image_url || '/default-company.png'}
//                             alt={job.Enterprise.name}
//                             className="rounded-circle w-24 h-24 object-cover mx-auto"
//                           />
//                         </div>
//                         <ul className="list-unstyled fs-5 text-dark mb-0">
//                           <li className="fw-bold">{job.Enterprise.name}</li>
//                           <li>🏢 Ngành: {job.Enterprise.industry || 'Chưa cập nhật'}</li>
//                           <li>📍 {job.Enterprise.location || 'Toàn quốc'}</li>
//                           <li>🌐 <a href={job.Enterprise.website || '#'} target="_blank" rel="noopener noreferrer">
//                             {job.Enterprise.website || 'Chưa có website'}
//                           </a></li>
//                           <li>📧 {job.Enterprise.contact_email || 'Chưa có email'}</li>
//                         </ul>
//                       </div>

//                       <div className="bg-white rounded shadow-sm p-4">
//                         <h5 className="fw-bold mb-3">Thông tin chung</h5>
//                         <ul className="list-unstyled fs-5 text-dark mb-0">
//                           <li>👥 Số lượng tuyển: 1</li>
//                           <li>🕒 {job.employment_type || 'Toàn thời gian'}</li>
//                           <li>💰 Phụ cấp: {job.allowance_min ? `${job.allowance_min.toLocaleString()} VND` : 'Thương lượng'}</li>
//                           {job.require_gpa_min && <li>🎓 GPA tối thiểu: {job.require_gpa_min.toFixed(1)}</li>}
//                           {job.internship_period && <li>⏳ Thời gian thực tập: {job.internship_period}</li>}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Nút quay lại */}
//                   <div className="text-center my-5">
//                     <Link
//                       href="/jobs"
//                       className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition inline-block"
//                     >
//                       ← Quay lại danh sách việc làm
//                     </Link>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// app/jobs/[jobId]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  work_mode: string | null;
  job_type: string | null;
  tags: string[] | null;
  created_at: string;
  company: {
    id: string;
    name: string;
    description: string | null;
    industry: string | null;
    location: string | null;
    website: string | null;
    image_url: string | null;
    contact_email: string | null;
  };
  skills: { name: string; required_level: number }[];
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

                <div className="d-flex flex-wrap gap-4 fs-5 mb-3 text-muted">
                  <div>📍 {job.locationName || 'Toàn quốc'}</div>
                  <div>💼 {job.job_type || 'Toàn thời gian'}</div>
                  <div>💰 Phụ cấp: {job.allowance_min ? `${job.allowance_min.toLocaleString()} - ${job.allowance_max?.toLocaleString()} VND` : 'Thương lượng'}</div>
                  <div>⏰ Hạn nộp: {formatDate(job.application_deadline)}</div>
                </div>

                <div className="d-flex gap-3">
                  <button className="btn btn-danger px-5 py-2 fs-5" disabled={!job.is_open}>
                    {job.is_open ? 'Ứng tuyển ngay' : 'Đã đóng tuyển'}
                  </button>
                  <button className="btn btn-outline-secondary px-5 py-2 fs-5">
                    ❤️ Lưu tin
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT */}
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                    <h5 className="fw-bold mb-3">Chi tiết tin tuyển dụng</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                          {job.category?.name || 'Frontend Developer'}
                        </span>
                      <span className="badge bg-light text-dark border px-3 py-2 fs-6">
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
                    <h5 className="fw-bold mb-3">Mô tả công việc</h5>
                    <div className="fs-5 text-dark whitespace-pre-wrap lh-lg">
                      {job.description || 'Không có mô tả chi tiết'}
                    </div>
                  </div>

                  {job.skills.length > 0 && (
                    <div className="bg-white rounded shadow-sm p-4">
                      <h5 className="fw-bold mb-3">Kỹ năng yêu cầu</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="badge bg-primary-subtle text-primary px-3 py-2 fs-6">
                            {skill.name} (Level {skill.required_level}/5)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-lg-4">
                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                    <h5 className="fw-bold mb-3">Thông tin công ty</h5>
                  
                    <ul className="list-unstyled fs-5 text-dark mb-0">
                      <li className="fw-bold">{job.company.name}</li>
                      <li>🏢 Ngành: {job.company.industry || 'Chưa cập nhật'}</li>
                      <li>📍 {job.company.location || 'Toàn quốc'}</li>
                      <li>🌐 <a href={job.company.website || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        {job.company.website || 'Chưa có website'}
                      </a></li>
                      <li>📧 {job.company.contact_email || 'Chưa có email'}</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded shadow-sm p-4">
                    <h5 className="fw-bold mb-3">Thông tin chung</h5>
                    <ul className="list-unstyled fs-5 text-dark mb-0">
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