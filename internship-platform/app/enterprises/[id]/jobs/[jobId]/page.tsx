// app/enterprises/[enterpriseId]/jobs/[jobId]/page.tsx

import { notFound } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
}

interface JobSkill {
  required_level: number;
  skill: Skill;
}

interface JobDetail {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_open: boolean;
  job_type: string | null;
  work_mode: string | null;
  internship_period: string | null;
  require_gpa_min: number | null;
  application_deadline: string | null;
  category: Category | null;
  location: Location | null;
  job_skills: JobSkill[];
  applications: { count: number } | null;
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
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string; jobId: string }>;
}) {
  // Await params trước
  const { id, jobId } = await params;

  let job: JobDetail | null = null;
  let errorMessage: string | null = null;

  try {
    // SỬA QUAN TRỌNG: Dùng URL tuyệt đối, không phụ thuộc window
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/enterprises/${id}/jobs/${jobId}`;

    console.log("Fetching job from:", apiUrl); // Debug server-side

    const res = await fetch(apiUrl, {
      cache: 'no-store', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API error response:", res.status, text);
      throw new Error(`HTTP ${res.status}: ${text || 'Không thể tải dữ liệu'}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || 'Lỗi từ API');
    }

    job = result.data as JobDetail;
  } catch (err) {
    console.error("Lỗi fetch job detail:", err);
    errorMessage = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tải thông tin công việc';
  }

  // Nếu không có job → 404
  if (!job) {
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
                {/* ===== JOB HEADER ===== */}
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                  <h2 className="text-2xl font-bold mb-3">
                    {job.title}
                  </h2>

                  <div className="d-flex flex-wrap gap-4 fs-5 mb-3 fs-5">
                    <div>📍 {job.location?.name || 'Hà Nội'}</div>
                    <div>💼 {job.job_type || 'Toàn thời gian'}</div>
                    <div>⏳ Kinh nghiệm: 3 năm</div>
                    <div>⏰ Hạn nộp: {formatDate(job.application_deadline)}</div>
                  </div>

                  <div className="d-flex gap-3">
                    <button className="btn btn-danger px-4 fs-5">
                      Ứng tuyển ngay
                    </button>
                    <button className="btn btn-outline-secondary px-4 fs-5">
                      ❤️ Lưu tin
                    </button>
                  </div>
                </div>

                {/* ===== MAIN CONTENT ===== */}
                <div className="row g-4">

                  {/* ===== LEFT ===== */}
                  <div className="col-lg-8">
                    <div className="bg-white rounded shadow-sm p-4 mb-4">
                      <h4 className="fw-bold mb-3">Chi tiết tin tuyển dụng</h4>

                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-light text-dark border px-3 py-2 fs-5">
                          {job.category?.name || 'Frontend Developer'}
                        </span>
                       
                        <span className="badge bg-light text-dark border px-3 py-2 fs-5">
                         {job.work_mode || 'Không xác định'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded shadow-sm p-4 mb-4">
                      <h5 className="fw-bold mb-3">Mô tả công việc</h5>
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

                  {/* ===== RIGHT ===== */}
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
                      <ul className="list-unstyled fs-5 text-dark mb-0 fs-4">
                        <li>📌 Cấp bậc: Nhân viên</li>
                        <li>🎓 Học vấn: Đại học</li>
                        <li>👤 Số lượng tuyển: 1</li>
                        <li>🕒 Toàn thời gian</li>
                        {job.require_gpa_min && <li>🎓 GPA tối thiểu: {job.require_gpa_min.toFixed(1)}</li>}
                        {job.internship_period && <li>⏳ Thời gian thực tập: {job.internship_period} tháng</li>}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
              <br></br>
              <br></br>

              <div className="text-center mt-10">
                <a
                  href={`/enterprises/${id}/jobs`}
                  className="px-6 py-3 bg-gray-600 text-black fs-5 rounded hover:bg-gray-700 transition inline-block"
                >
                  Quay lại danh sách
                </a>
              </div>
          </div>
        </div>
         
  
    </>
  );
}