import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, LoginCredentials } from '@/lib/auth'

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    setError(null)
    setLoading(true)

    try {
      // Validate
      if (!credentials.email || !credentials.password) {
        throw new Error('Vui lòng nhập email và mật khẩu')
      }

      // Login
      const authResponse = await AuthService.login(credentials)

      // Save tokens
      AuthService.saveTokens(authResponse)

      // Redirect
      router.push('/profile')
      
      return authResponse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    AuthService.logout()
    router.push('/login')
  }

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated: AuthService.isAuthenticated(),
  }
}