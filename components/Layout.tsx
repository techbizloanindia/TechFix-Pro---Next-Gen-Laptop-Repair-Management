import { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="page-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-6 fade-in-up">
              <div className="icon-wrapper floating-animation pulse-glow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold gradient-text tracking-tight">TechFix Pro</h1>
                <p className="text-lg text-gray-700 font-semibold mt-1">Advanced Laptop Repair Management</p>
              </div>
            </div>

            {/* User Info and Logout */}
            {user && (
              <div className="flex items-center space-x-6 bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/20 shadow-lg">
                <div className="text-right">
                  <p className="text-white font-bold text-lg">Welcome, {user.name}</p>
                  <p className="text-blue-200 font-medium text-sm">{user.username}</p>
                </div>
                <div className="w-px h-10 bg-white/30"></div>
                <button
                  onClick={logout}
                  className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12 fade-in-up">
          {children}
        </div>
      </main>

      <footer className="glass-effect mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text">TechFix Pro</span>
            </div>
            <p className="text-gray-700 mb-3 font-medium">&copy; 2025 TechFix Pro - Next-Gen Laptop Repair Management</p>
            <p className="text-gray-600">Revolutionizing repairs with intelligent solutions</p>
          </div>
        </div>
      </footer>
    </div>
  )
}