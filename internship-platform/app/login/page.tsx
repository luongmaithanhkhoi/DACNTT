// import Head from "next/head";
// import Script from "next/script";

// export default function LoginPage() {
//   return (
//     <>
//       {/* ===== Inner heading ===== */}
//       <div className="inner-heading">
//         <div className="container">
//           <h3>Login</h3>
//         </div>
//       </div>

//       {/* ===== Login Content ===== */}
//       <div className="inner-content loginWrp">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-3" />
//             <div className="col-lg-6">
//               <div className="login">
//                 <div className="contctxt">User Login</div>

//                 <div className="formint conForm">
//                   <form>
//                     <div className="input-wrap">
//                       <label className="input-group-addon">Email</label>
//                       <input
//                         type="text"
//                         placeholder="User Name"
//                         className="form-control"
//                       />
//                     </div>

//                     <div className="input-wrap">
//                       <label className="input-group-addon">
//                         Password <span><a href="#">Forgot Password?</a></span>
//                       </label>
//                       <input
//                         type="password"
//                         placeholder="Password"
//                         className="form-control"
//                       />
//                     </div>

//                     <div className="sub-btn">
//                       <input type="submit" className="sbutn" value="Login" />
//                     </div>

//                     <div className="newuser">
//                       <i className="fa fa-user" /> New User?
//                       <a href="/register"> Register Here</a>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-3" />
            
//           </div>
          
//         </div>
//       </div>
//     </>
//   );
// }


// 'use client'

// import { useState, FormEvent } from 'react'
// import Head from 'next/head'
// import Script from 'next/script'
// import { useRouter } from 'next/navigation'

// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setError(null)
//     setLoading(true)

//     try {
//       // Validate input
//       if (!email || !password) {
//         setError('Vui lòng nhập email và mật khẩu')
//         setLoading(false)
//         return
//       }

//       // Call login API
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.error || 'Đăng nhập thất bại')
//       }

//       // Save token to localStorage
//       localStorage.setItem('auth_token', data.access_token)
//       if (data.refresh_token) {
//         localStorage.setItem('refresh_token', data.refresh_token)
//       }

//       // Save user info (optional)
//       localStorage.setItem('user', JSON.stringify(data.user))

//       // Redirect to profile or home page
//       router.push('/profile')
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Head>
//         <meta charSet="utf-8" />
//         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>Login | Job Finder</title>

//         <link rel="shortcut icon" href="favicon.ico" />
//         <link href="/css/bootstrap.min.css" rel="stylesheet" />
//         <link href="/css/owl.carousel.css" rel="stylesheet" />
//         <link href="/css/font-awesome.css" rel="stylesheet" />
//         <link href="/css/style.css" rel="stylesheet" />
//       </Head>

//       {/* ===== Inner heading ===== */}
//       <div className="inner-heading">
//         <div className="container">
//           <h3>Login</h3>
//         </div>
//       </div>

//       {/* ===== Login Content ===== */}
//       <div className="inner-content loginWrp">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-3" />
//             <div className="col-lg-6">
//               <div className="login">
//                 <div className="contctxt">User Login</div>

//                 {/* Error message */}
//                 {error && (
//                   <div 
//                     className="alert alert-danger" 
//                     role="alert"
//                     style={{ marginBottom: '20px' }}
//                   >
//                     {error}
//                   </div>
//                 )}

//                 <div className="formint conForm">
//                   <form onSubmit={handleSubmit}>
//                     <div className="input-wrap">
//                       <label className="input-group-addon">Email</label>
//                       <input
//                         type="email"
//                         placeholder="Enter your email"
//                         className="form-control"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         disabled={loading}
//                         required
//                       />
//                     </div>

//                     <div className="input-wrap">
//                       <label className="input-group-addon">
//                         Password{' '}
//                         <span>
//                           <a href="/forgot-password">Forgot Password?</a>
//                         </span>
//                       </label>
//                       <input
//                         type="password"
//                         placeholder="Enter your password"
//                         className="form-control"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         disabled={loading}
//                         required
//                       />
//                     </div>

//                     <div className="sub-btn">
//                       <input
//                         type="submit"
//                         className="sbutn"
//                         value={loading ? 'Đang đăng nhập...' : 'Login'}
//                         disabled={loading}
//                         style={{
//                           opacity: loading ? 0.7 : 1,
//                           cursor: loading ? 'not-allowed' : 'pointer',
//                         }}
//                       />
//                     </div>

//                     <div className="newuser">
//                       <i className="fa fa-user" /> New User?
//                       <a href="/register"> Register Here</a>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-3" />
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



import Head from 'next/head'
import Script from 'next/script'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Job Finder</title>
      </Head>

      <div className="inner-heading">
        <div className="container">
          <h3>Login</h3>
        </div>
      </div>

      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row">
            <div className="col-lg-3" />
            <div className="col-lg-6">
              <LoginForm />
            </div>
            <div className="col-lg-3" />
          </div>
        </div>
      </div>

      <Script src="/js/jquery-2.1.4.min.js" />
      <Script src="/js/bootstrap.bundle.min.js" />
    </>
  )
}