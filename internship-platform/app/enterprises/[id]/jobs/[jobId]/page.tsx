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
  skills: JobSkill[];
  applications: { count: number } | null;
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
            
              {/* <div className="login p-8 bg-white rounded shadow-sm">
                {errorMessage && (
                  <div className="text-center text-red-600 mb-6 font-medium">
                    {errorMessage}
                  </div>
                )}

                {job && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{job.title}</h2>
                    <br></br>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
                      <div><strong>Chức vụ:</strong> {job.category?.name || 'Chưa phân loại'}</div>
                      <div><strong>Địa điểm:</strong> {job.location?.name || 'Toàn quốc'}</div>
                      <div><strong>Vai trò:</strong> {job.job_type || 'Không xác định'}</div>
                      <div><strong>Hình thức làm việc:</strong> {job.work_mode || 'Không xác định'}</div>
                      <div>
                        <strong>Trạng thái:</strong>{' '}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {job.is_open ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </div>
                      <div><strong>Ngày đăng:</strong> {formatDate(job.created_at)}</div>
                      {job.internship_period && (
                        <div><strong>Thời gian thực tập:</strong> {job.internship_period}</div>
                      )}
                      {job.require_gpa_min !== null && (
                        <div><strong>GPA tối thiểu:</strong> {job.require_gpa_min.toFixed(1)}</div>
                      )}
                      {job.application_deadline && (
                        <div><strong>Hạn nộp hồ sơ:</strong> {formatDate(job.application_deadline)}</div>
                      )}
                      <div><strong>Số lượng ứng tuyển:</strong> {job.applications?.count || 0}</div>
                       
                    </div>
                    <br></br>
                        <div className="mb-6">
                          <div className="font-bold mb-3 text-lg">Mô tả công việc</div>
                          <div 
                            className="prose max-w-none text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-4"
                            style={{ 
                              minHeight: '150px', 
                              maxHeight: '400px',   // Giới hạn chiều cao tối đa
                              overflowY: 'auto'     // Cho phép cuộn dọc khi nội dung dài
                            }}
                          >
                            {job.description ? (
                              <div className="whitespace-pre-wrap">{job.description}</div>
                            ) : (
                              <p className="text-gray-500 italic">Không có mô tả chi tiết.</p>
                            )}
                          </div>
                        </div>
                     
                    {job.skills && job.skills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">Kỹ năng yêu cầu</h4>
                        <div className="flex flex-wrap gap-3">
                          {job.skills.map((js) => (
                            <span
                              key={js.skill.id}
                              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {js.skill.name} (Level {js.required_level}/5)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <br></br>
                    <br></br>

                    <div className="text-center mt-10">
                      <a
                        href={`/enterprises/${id}/jobs`}
                        className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition inline-block"
                      >
                        Quay lại danh sách
                      </a>
                    </div>
                  </>
                )}
              </div> */}

              <div className="col-12">
                {/* ===== JOB HEADER ===== */}
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                  <h2 className="text-2xl font-bold mb-3">
                    {job.title}
                  </h2>

                  <div className="d-flex flex-wrap gap-4 fs-5 mb-3">
                    <div>📍 {job.location?.name || 'Hà Nội'}</div>
                    <div>💼 {job.job_type || 'Toàn thời gian'}</div>
                    <div>⏳ Kinh nghiệm: 3 năm</div>
                    <div>⏰ Hạn nộp: {formatDate(job.application_deadline)}</div>
                  </div>

                  <div className="d-flex gap-3">
                    <button className="btn btn-danger px-4">
                      Ứng tuyển ngay
                    </button>
                    <button className="btn btn-outline-secondary px-4">
                      ❤️ Lưu tin
                    </button>
                  </div>
                </div>

                {/* ===== MAIN CONTENT ===== */}
                <div className="row g-4">

                  {/* ===== LEFT ===== */}
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
                      </div>
                    </div>

                    <div className="bg-white rounded shadow-sm p-4 mb-4">
                      <h5 className="fw-bold mb-3">Mô tả công việc</h5>
                      <div className="fs-5 text-dark whitespace-pre-wrap lh-lg">
                        {job.description || 'Không có mô tả chi tiết'}
                      </div>
                    </div>

                    {job.skills?.length > 0 && (
                      <div className="bg-white rounded shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Kỹ năng cần có</h5>
                        <div className="d-flex flex-wrap gap-2">
                          {job.skills.map((js) => (
                            <span
                              key={js.skill.id}
                              className="badge bg-primary-subtle text-primary border px-3 py-2 fs-6"
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
                      <h5 className="fw-bold mb-3">Thông tin công ty</h5>
                      <ul className="list-unstyled fs-5 text-dark mb-0">
                        <li>🏢 Công ty TNHH LG CNS Việt Nam</li>
                        <li>👥 100 – 499 nhân viên</li>
                        <li>💻 IT - Phần mềm</li>
                        <li>📍 Hà Nội</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded shadow-sm p-4">
                      <h5 className="fw-bold mb-3">Thông tin chung</h5>
                      <ul className="list-unstyled fs-5 text-dark mb-0">
                        <li>📌 Cấp bậc: Nhân viên</li>
                        <li>🎓 Học vấn: Đại học</li>
                        <li>👤 Số lượng tuyển: 1</li>
                        <li>🕒 Toàn thời gian</li>
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