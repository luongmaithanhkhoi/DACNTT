
'use client'

import Link from 'next/link'
import { ProfileData } from './types'

export default function ProfileContent({ data }: { data: ProfileData }) {
  const { profile, skills, stats, savedJobs = [] } = data

  // Hàm tính số ngày còn lại
  const getDaysRemaining = (deadline?: string): { text: string; isExpired: boolean } => {
    if (!deadline) return { text: 'Không giới hạn', isExpired: false };
    
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days > 0) return { text: `Còn ${days} ngày để ứng tuyển`, isExpired: false };
    if (days === 0) return { text: 'Hôm nay là hạn cuối', isExpired: false };
    return { text: 'Đã hết hạn', isExpired: true };
  };

  return (
    <div className="inner-content">
      <div className="container">

        {/* ===== AVATAR TRÊN CÙNG ===== */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 text-center">
           <div className="d-flex justify-content-center">
             <img
              src={profile.avatar_url || "/images/client.jpg"}
              alt="Profile"
              className="mb-3"
              style={{ width: 200, height: 200, borderRadius: "50%" }}
            />
           </div>
            <h3>{profile.full_name || "Chưa cập nhật"}</h3>
            <p className="text-danger fs-5">
              {profile.major || "Chưa có chuyên ngành"}
            </p>

            <Link href="/profile/edit" className="btn btn-danger mt-2 fs-5">
              EDIT PROFILE
            </Link>
          </div>
        </div>

        {/* ===== THÔNG TIN CHÍNH ===== */}
        <div className="row candidate-details-wrap text-center">

          {/* ===== LEFT: THÔNG TIN CÁ NHÂN ===== */}
          <div className="col-lg-6 col-md-6 fs-4">
            <div className="candidate-info-block">
              <h3>Thông tin cá nhân</h3>
              <ul className="candidate-details list-unstyled mt-3">
                <li>
                  <i className="fa fa-envelope me-2" />
                  {profile.email}
                </li>

                {profile.phone && (
                  <li>
                    <i className="fa fa-phone me-2" />
                    {profile.phone}
                  </li>
                )}

                {profile.location && (
                  <li>
                    <i className="fa fa-map-marker me-2" />
                    {profile.location}
                  </li>
                )}

                {profile.gpa && (
                  <li>
                    <i className="fa fa-graduation-cap me-2" />
                    GPA: {profile.gpa}
                  </li>
                )}

                {profile.portfolio_url && (
                  <li>
                    <i className="fa fa-link me-2" />
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Portfolio
                    </a>
                  </li>
                )}
              </ul>

              
            </div>
          </div>

          {/* ===== RIGHT: KỸ NĂNG + CV ===== */}
          <div className="col-lg-6 col-md-6 fs-4">
            <h4>Thông tin</h4>
            <p className="mt-3">
                {profile.summary || "Chưa có thông tin."}
              </p>

            {/* KỸ NĂNG */}
            {skills.length > 0 && (
              <div className="candidate-skill-block mb-4">
                <h4>Kỹ năng</h4>
                <ul className="list-unstyled mt-3">
                  {skills.map((skill) => (
                    <li key={skill.id}>
                      {skill.name} – <i>{skill.level}</i>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CV */}
            <div className="candidate-info-block">
              <h4>Link CV cá nhân</h4>
              {profile.cv_url ? (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-underline"
                >
                  Xem CV
                </a>
              ) : (
                <p>Chưa có thông tin.</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== THỐNG KÊ ===== */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-center mb-3">
              Thống kê các vị trí đã apply
            </h3>

            <div className="d-flex justify-content-center">
              <table
                className="table table-bordered text-center fs-4"
                style={{ width: "60%" }}
              >
                <thead>
                  <tr>
                    <th>Tổng</th>
                    <th>Đang chờ</th>
                    <th>Chấp nhận</th>
                    <th>Từ chối</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{stats.applications}</td>
                    <td>{stats.pending}</td>
                    <td>{stats.accepted}</td>
                    <td>{stats.rejected}</td>
                    <td>
                      <Link
                        href="/students/applications"
                        className="btn btn-outline-primary"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== TIN ĐÃ LƯU ===== */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-center mb-4">
              Tin đã lưu ({savedJobs.length})
            </h3>

            {savedJobs.length === 0 ? (
              <div className="text-center py-5">
                <p>Bạn chưa lưu tin tuyển dụng nào.</p>
                <Link href="/jobs" className="btn btn-primary">
                  Tìm việc ngay
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {savedJobs.map((job) => {
                  const { text, isExpired } = getDaysRemaining(
                    job.applicationDeadline
                  );

                  return (
                    <div key={job.id} className="col-md-6 col-lg-4">
                      <div className="bg-white rounded shadow p-4">
                        <h4>
                          <Link href={`/jobs/${job.id}`}>
                            {job.title}
                          </Link>
                        </h4>

                        <p>{job.company}</p>
                        <p>{job.location}</p>

                        <p
                          className={`fw-bold ${
                            isExpired
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}