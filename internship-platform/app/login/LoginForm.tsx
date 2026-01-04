// 'use client'

// import { useState, FormEvent } from 'react'
// import { useLogin } from './useLogin'

// export default function LoginForm() {
//   const { submit, loading, error } = useLogin()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault()
//     submit(email, password)
//   }

//   return (
//     <div className="login">
//       <div className="contctxt">User Login</div>

//       {error && <div className="alert alert-danger">{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="input-wrap">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             disabled={loading}
//           />
//         </div>

//         <div className="input-wrap">
//           <label>
//             Password <a href="/forgot-password">Forgot?</a>
//           </label>
//           <input
//             type="password"
//             className="form-control"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             disabled={loading}
//           />
//         </div>

//         <input
//           type="submit"
//           className="sbutn"
//           value={loading ? 'Đang đăng nhập...' : 'Login'}
//           disabled={loading}
//         />
//       </form>
//     </div>
//   )
// }

"use client";

import { useLogin } from "./useLogin"; // Điều chỉnh path nếu cần

export default function LoginForm() {
  const { submit, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    submit(email, password);
  };

  return (
    <div className="login">
      <div className="contctxt">User Login</div>

      {error && (
        <div className="alert alert-danger text-center mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="formint conForm">
        <form onSubmit={handleSubmit}>
          <div className="input-wrap">
            <label className="input-group-addon">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="input-wrap">
            <label className="input-group-addon">
              Password{' '}
              <span>
                <a href="/forgot-password">Forgot Password?</a>
              </span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="sub-btn">
            <input
              type="submit"
              className="sbutn"
              value={loading ? 'Đang đăng nhập...' : 'Login'}
              disabled={loading}
            />
          </div>

          <div className="newuser">
            <i className="fa fa-user" aria-hidden="true" /> New User?{' '}
            <a href="/register">Register Here</a>
          </div>
        </form>
      </div>
    </div>
  );
}