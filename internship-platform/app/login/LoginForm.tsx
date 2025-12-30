'use client'

import { useState, FormEvent } from 'react'
import { useLogin } from './useLogin'

export default function LoginForm() {
  const { submit, loading, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit(email, password)
  }

  return (
    <div className="login">
      <div className="contctxt">User Login</div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-wrap">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-wrap">
          <label>
            Password <a href="/forgot-password">Forgot?</a>
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <input
          type="submit"
          className="sbutn"
          value={loading ? 'Đang đăng nhập...' : 'Login'}
          disabled={loading}
        />
      </form>
    </div>
  )
}