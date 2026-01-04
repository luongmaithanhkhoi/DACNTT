'use client'

import Link from 'next/link'
import { ProfileData } from './types'

export default function ProfileContent({ data }: { data: ProfileData }) {
  const { profile, skills, stats, savedJobs = []} = data

  return (
    <div className="inner-content">
      <div className="container">
        <div className="row candidate-details-wrap">

          {/* LEFT */}
          <div className="col-lg-6 col-md-5">
            <div className="candidate-info text-center">
             <div className="d-flex justify-content-center">
                <img
                src={profile.avatar_url || '/images/client.jpg'}
                alt="Profile"
                className="mb-3"
                style={{ width: 200, height: 200, borderRadius: '50%' }}
                />
            </div>

              <h3>
                {profile.full_name || 'Chưa cập nhật'}
              </h3>

              <p className="designation text-danger">
                {profile.major || 'Chưa có chuyên ngành'}
              </p>

              <ul className="candidate-details fs-4">
                <li><i className="fa fa-envelope" /> {profile.email}</li>
                {profile.phone && <li><i className="fa fa-phone" /> {profile.phone}</li>}
                {profile.location && <li><i className="fa fa-map-marker" /> {profile.location}</li>}
                {profile.gpa && <li><i className="fa fa-graduation-cap" /> GPA: {profile.gpa}</li>}
              </ul>

             

              <a href="/profile/edit" className="btn btn-danger mt-3 fs-4">
                EDIT PROFILE
              </a>
            </div>
          </div>

          {/* RIGHT */}
            <div className="col-lg-6 col-md-7 fs-4">
                <div className="candidate-info-block"> {/* tạo block riêng để tách flow */}
                    <h3 className="mt-3">About Me</h3>
                    <p>{profile.summary || 'Chưa có thông tin.'}</p>
                </div>

                {skills.length > 0 && (
                    <div className="candidate-skill-block mt-4">
                    <h3>Skills</h3>
                    <ul className="list-unstyled">
                        {skills.map(skill => (
                        <li key={skill.id}>
                            {skill.name} – <i>{skill.level}</i>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </div>
                
                </div>
        {/* TABLE THỐNG KÊ */}
        <div className="row mt-4">
        <div className="col-12">
            <h3 className="text-center mb-3">Thống kê các vị trí đã apply</h3>

            <div className="d-flex justify-content-center">
            <table className="table table-bordered text-center" style={{ width: '60%' }}>
                <thead className="fs-4">
                <tr>
                    <th>Tổng</th>
                    <th>Đang chờ phản hồi</th>
                    <th>Chấp nhận</th>
                    <th>Từ chối</th>
                </tr>
                </thead>
                <tbody className="fs-4">
                <tr>
                    <td>{stats.applications}</td>
                    <td>{stats.pending}</td>
                    <td>{stats.accepted}</td>
                    <td>{stats.rejected}</td>
                </tr>
                </tbody>
            </table>
            </div>
             <div className="col-12">
              <h3 className="text-center mb-4 text-xl font-bold">
                Tin đã lưu ({savedJobs.length})
              </h3>

              {savedJobs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 text-lg mb-4">
                    Bạn chưa lưu tin tuyển dụng nào.
                  </p>
                  <Link href="/jobs" className="btn btn-primary px-6 py-3">
                    Tìm việc ngay
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="col-md-6 col-lg-4">
                      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-5 border border-gray-200">
                        <h4 className="font-bold text-lg mb-2">
                          <Link 
                            href={`/jobs/${job.id}`} 
                            className="text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            {job.title}
                          </Link>
                        </h4>
                        <p className="text-gray-700 mb-2">
                          <i className="fa fa-building mr-2 text-gray-500" />
                          {job.company}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                          <i className="fa fa-map-marker mr-2" />
                          {job.location}
                        </p>
                        {/* <p className="text-gray-500 text-xs">
                          Lưu lúc: {new Date(job.created_at).toLocaleDateString('vi-VN')}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

        </div>
        </div>
        <div className="row mt-5">
 
</div>
      </div>
    </div>
  )
}
