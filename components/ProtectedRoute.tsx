import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Strict authentication check
    if (!loading) {
      if (!user && router.pathname !== '/login') {
        console.log('🚫 Access denied - User not authenticated, redirecting to login')
        router.push('/login')
        return
      }
      
      // Additional security: verify user has required fields
      if (user && (!user.id || !user.username || !user.name)) {
        console.log('🚫 Access denied - Invalid user data, forcing re-login')
        localStorage.removeItem('authUser')
        router.push('/login')
        return
      }
      
      // If user is authenticated and on login page, redirect to dashboard
      if (user && router.pathname === '/login') {
        console.log('✅ User already authenticated, redirecting to dashboard')
        router.push('/')
        return
      }
    }
  }, [user, loading, router])

  // Show authentication loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-violet-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not authenticated and not on login page
  if (!user && router.pathname !== '/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You must be logged in to access this system</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}