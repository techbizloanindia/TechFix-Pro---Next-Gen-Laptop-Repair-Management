import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

interface User {
  id: string
  username: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...')
      const response = await fetch('/api/auth/me')
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ User authenticated:', data.user.name)
        setUser(data.user)
      } else {
        console.log('❌ User not authenticated, redirecting to login')
        setUser(null)
        // Redirect to login if not on login page
        if (router.pathname !== '/login') {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('❌ Auth check error:', error)
      setUser(null)
      if (router.pathname !== '/login') {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = (userData: User) => {
    console.log('🔐 User logged in:', userData.name)
    setUser(userData)
    localStorage.setItem('authUser', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...')
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      localStorage.removeItem('authUser')
      localStorage.removeItem('lastLoginUser')
      console.log('✅ User logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      localStorage.removeItem('authUser')
      localStorage.removeItem('lastLoginUser')
      router.push('/login')
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}