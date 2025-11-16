'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default function UpdatePasswordPage() {
  const [pwd, setPwd] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    // Khi người dùng truy cập từ email link, Supabase gắn access_token trong URL fragment.
    // @supabase/supabase-js sẽ tự lấy token từ URL nếu cần.
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const sb = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
    const { data: { user }, error: getErr } = await sb.auth.getUser()
    if (getErr || !user) {
      setMsg('Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu email khôi phục lại.')
      return
    }
    const { error } = await sb.auth.updateUser({ password: pwd })
    setMsg(error ? error.message : 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.')
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-3">
      <h1 className="text-xl font-semibold">Cập nhật mật khẩu</h1>
      <form onSubmit={onSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Mật khẩu mới"
          value={pwd}
          onChange={e=>setPwd(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2">Cập nhật</button>
      </form>
      <div>{msg}</div>
    </div>
  )
}
