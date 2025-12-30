'use client'

import { ProfileData } from './types'

export default function ProfileContent({ data }: { data: ProfileData }) {
  const { profile, skills, stats } = data

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

              <ul className="candidate-details">
                <li><i className="fa fa-envelope" /> {profile.email}</li>
                {profile.phone && <li><i className="fa fa-phone" /> {profile.phone}</li>}
                {profile.location && <li><i className="fa fa-map-marker" /> {profile.location}</li>}
                {profile.gpa && <li><i className="fa fa-graduation-cap" /> GPA: {profile.gpa}</li>}
              </ul>

             

              <a href="/profile/edit" className="btn btn-danger mt-3">
                EDIT PROFILE
              </a>
            </div>
          </div>

          {/* RIGHT */}
            <div className="col-lg-6 col-md-7">
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
                <thead>
                <tr>
                    <th>Tổng</th>
                    <th>Đang chờ phản hồi</th>
                    <th>Chấp nhận</th>
                    <th>Từ chối</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{stats.applications}</td>
                    <td>{stats.pending}</td>
                    <td>{stats.accepted}</td>
                    <td>{stats.rejected}</td>
                </tr>
                </tbody>
            </table>
            </div>

        </div>
        </div>
      </div>
    </div>
  )
}
