interface NavigationProps {
  activeTab: 'add' | 'list' | 'resolved'
  onTabChange: (tab: 'add' | 'list' | 'resolved') => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { 
      id: 'add' as const, 
      name: 'Add Query', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      description: 'Submit new repair request',
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'list' as const, 
      name: 'List Queries', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: 'Process pending queries',
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      id: 'resolved' as const, 
      name: 'Resolved', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'View completed queries',
      gradient: 'from-blue-500 to-cyan-600'
    },
  ]

  return (
    <div className="mb-16">
      <nav className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl`
                : 'bg-white/70 backdrop-blur-lg text-gray-700 hover:bg-white/90 border border-white/30 shadow-xl hover:shadow-2xl'
            }`}
          >
            <div className="relative p-8 text-center">
              {/* Background glow effect */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
                activeTab === tab.id ? 'opacity-20' : 'group-hover:opacity-10'
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tab.gradient} rounded-full blur-3xl transform translate-x-8 -translate-y-8`}></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${tab.gradient} rounded-full blur-2xl transform -translate-x-6 translate-y-6`}></div>
              </div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-500 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white scale-110'
                  : `bg-gradient-to-r ${tab.gradient} text-white group-hover:scale-110 shadow-lg`
              }`}>
                {tab.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-xl mb-3 tracking-wide">{tab.name}</h3>
              <p className={`text-sm transition-colors duration-300 font-medium ${
                activeTab === tab.id
                  ? 'text-white/90'
                  : 'text-gray-600 group-hover:text-gray-700'
              }`}>
                {tab.description}
              </p>
              
              {/* Active indicator with enhanced styling */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-white rounded-full shadow-lg"></div>
              )}
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'shadow-2xl' 
                  : 'group-hover:shadow-xl opacity-0 group-hover:opacity-100'
              }`}></div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}