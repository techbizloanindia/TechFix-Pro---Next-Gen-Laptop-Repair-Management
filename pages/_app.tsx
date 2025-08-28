import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  // Pages that don't require authentication
  const publicPages = ['/login']
  const isPublicPage = publicPages.includes(router.pathname)

  return (
    <AuthProvider>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  )
}