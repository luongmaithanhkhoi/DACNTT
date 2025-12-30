// 'use client'

// import { useEffect, useState } from 'react'
// import Head from 'next/head'
// import Script from 'next/script'
// import { useRouter } from 'next/navigation'

// interface StudentProfile {
//   user_id: string
//   email: string
//   avatar_url?: string
//   full_name?: string
//   major?: string
//   gpa?: number
//   summary?: string
//   phone?: string
//   location?: string
//   portfolio_url?: string
//   socials?: Record<string, string>
//   languages?: string[]
//   cv_url?: string
//   enrollment_year?: number
//   graduation_year?: number
//   created_at: string
//   updated_at: string
// }

// interface Skill {
//   id: string
//   name: string
//   level: string
// }

// interface Stats {
//   applications: number
//   pending: number
//   accepted: number
//   rejected: number
// }

// interface ProfileData {
//   profile: StudentProfile
//   skills: Skill[]
//   stats: Stats
// }

// export default function Profile() {
//   const router = useRouter()
//   const [data, setData] = useState<ProfileData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       // Lấy token từ localStorage hoặc cookies
//       const token = localStorage.getItem('auth_token')
      
//       if (!token) {
//         router.push('/login')
//         return
//       }

//       const res = await fetch('/api/students/me', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })

//       if (!res.ok) {
//         if (res.status === 401) {
//           router.push('/login')
//           return
//         }
//         throw new Error('Failed to fetch profile')
//       }

//       const json = await res.json()
//       setData(json)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="inner-content">
//         <div className="container">
//           <div className="text-center py-5">
//             <p>Đang tải thông tin...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !data) {
//     return (
//       <div className="inner-content">
//         <div className="container">
//           <div className="alert alert-danger">
//             {error || 'Không thể tải thông tin profile'}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const { profile, skills, stats } = data

//   return (
//     <>
//       <Head>
//         <meta charSet="utf-8" />
//         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>My Profile | Job Finder</title>

//         <link rel="shortcut icon" href="favicon.ico" />
//         <link href="/css/bootstrap.min.css" rel="stylesheet" />
//         <link href="/css/owl.carousel.css" rel="stylesheet" />
//         <link href="/css/font-awesome.css" rel="stylesheet" />
//         <link href="/css/style.css" rel="stylesheet" />
//       </Head>

//       {/* ===== PAGE TITLE ===== */}
//       <div className="inner-heading">
//         <div className="container">
//           <h1>My Profile</h1>
//         </div>
//       </div>

//       {/* ===== PROFILE WRAP ===== */}
//       <div className="inner-content">
//         <div className="container">
//           <div className="row candidate-details-wrap">

//             {/* ===== LEFT SIDEBAR ===== */}
//             <div className="col-lg-4 col-md-5">
//               <div
//                 className="candidate-info"
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                 }}
//               >
//                 {/* Avatar */}
//                 <div className="candidate-img mb-3">
//                   <img
//                     src={profile.avatar_url || '/images/client.jpg'}
//                     alt="Profile"
//                     style={{
//                       width: '90px',
//                       height: '90px',
//                       borderRadius: '50%',
//                       objectFit: 'cover',
//                     }}
//                   />
//                 </div>

//                 {/* Name */}
//                 <h3 style={{ marginBottom: '4px' }}>
//                   <span style={{ fontWeight: 500 }}>Tên:</span>{' '}
//                   <span style={{ fontWeight: 700 }}>
//                     {profile.full_name || 'Chưa cập nhật'}
//                   </span>
//                 </h3>

//                 {/* Major */}
//                 <p
//                   className="designation"
//                   style={{
//                     color: 'red',
//                     fontWeight: 600,
//                     marginBottom: '14px',
//                   }}
//                 >
//                   {profile.major || 'Chưa có chuyên ngành'}
//                 </p>

//                 {/* Info list */}
//                 <ul
//                   className="candidate-details"
//                   style={{
//                     listStyle: 'none',
//                     padding: 0,
//                     margin: 0,
//                     textAlign: 'left',
//                   }}
//                 >
//                   <li>
//                     <i className="fa fa-envelope"></i> {profile.email}
//                   </li>
//                   {profile.phone && (
//                     <li>
//                       <i className="fa fa-phone"></i> {profile.phone}
//                     </li>
//                   )}
//                   {profile.location && (
//                     <li>
//                       <i className="fa fa-map-marker"></i> {profile.location}
//                     </li>
//                   )}
//                   {profile.gpa && (
//                     <li>
//                       <i className="fa fa-graduation-cap"></i> GPA: {profile.gpa}
//                     </li>
//                   )}
//                   {profile.enrollment_year && profile.graduation_year && (
//                     <li>
//                       <i className="fa fa-calendar"></i> {profile.enrollment_year} - {profile.graduation_year}
//                     </li>
//                   )}
//                 </ul>

//                 {/* Stats */}
//                 <div className="mt-3 w-100">
//                   <h5>Thống kê đơn ứng tuyển</h5>
//                   <ul style={{ listStyle: 'none', padding: 0 }}>
//                     <li>Tổng: {stats.applications}</li>
//                     <li>Đang chờ: {stats.pending}</li>
//                     <li>Chấp nhận: {stats.accepted}</li>
//                     <li>Từ chối: {stats.rejected}</li>
//                   </ul>
//                 </div>

//                 {/* Button */}
//                 <div className="read-btn mt-3">
//                   <a
//                     href="/profile/edit"
//                     style={{
//                       display: 'inline-block',
//                       padding: '10px 30px',
//                       background: '#ff1d1d',
//                       color: '#fff',
//                       fontWeight: 700,
//                       textAlign: 'center',
//                     }}
//                   >
//                     EDIT PROFILE
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* ===== RIGHT CONTENT ===== */}
//             <div className="col-lg-8 col-md-7">
//               <div className="candidate-description">

//                 {/* ABOUT */}
//                 <div className="profile-block">
//                   <h3>About Me</h3>
//                   <p>
//                     {profile.summary || 'Chưa có thông tin giới thiệu.'}
//                   </p>
//                 </div>

//                 {/* SKILLS */}
//                 {skills.length > 0 && (
//                   <div className="profile-block">
//                     <h3>Skills</h3>
//                     <ul className="skill-list">
//                       {skills.map((skill, idx) => (
//                         <li key={idx}>
//                           {skill.name} - <span style={{ fontStyle: 'italic' }}>{skill.level}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* LANGUAGES */}
//                 {profile.languages && profile.languages.length > 0 && (
//                   <div className="profile-block">
//                     <h3>Languages</h3>
//                     <ul className="skill-list">
//                       {profile.languages.map((lang, idx) => (
//                         <li key={idx}>{lang}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* PORTFOLIO & CV */}
//                 {(profile.portfolio_url || profile.cv_url) && (
//                   <div className="profile-block">
//                     <h3>Documents</h3>
//                     {profile.portfolio_url && (
//                       <p>
//                         <i className="fa fa-link"></i>{' '}
//                         <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
//                           Portfolio
//                         </a>
//                       </p>
//                     )}
//                     {profile.cv_url && (
//                       <p>
//                         <i className="fa fa-file-pdf-o"></i>{' '}
//                         <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
//                           Download CV
//                         </a>
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* SOCIALS */}
//                 {profile.socials && Object.keys(profile.socials).length > 0 && (
//                   <div className="profile-block">
//                     <h3>Social Links</h3>
//                     {Object.entries(profile.socials).map(([key, value]) => (
//                       <p key={key}>
//                         <i className="fa fa-globe"></i>{' '}
//                         <a href={String(value)} target="_blank" rel="noopener noreferrer">
//                           {key}
//                         </a>
//                       </p>
//                     ))}
//                   </div>
//                 )}

//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ===== JS ===== */}
//       <Script src="/js/jquery-2.1.4.min.js" strategy="beforeInteractive" />
//       <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
//       <Script src="/js/owl.carousel.js" strategy="afterInteractive" />
//       <Script src="/js/script.js" strategy="afterInteractive" />
//     </>
//   )
// }


'use client'

import Head from 'next/head'
import Script from 'next/script'
import { useProfile } from './useProfile'
import ProfileContent from './ProfileContent'

export default function ProfilePage() {
  const { data, loading, error } = useProfile()

  if (loading) {
    return <p className="text-center py-5">Đang tải thông tin...</p>
  }

  if (error || !data) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <>
      <Head>
        <title>My Profile | Job Finder</title>
      </Head>

      <div className="inner-heading">
        <div className="container">
          <h1>My Profile</h1>
        </div>
      </div>

      <ProfileContent data={data} />

      <Script src="/js/bootstrap.bundle.min.js" />
    </>
  )
}