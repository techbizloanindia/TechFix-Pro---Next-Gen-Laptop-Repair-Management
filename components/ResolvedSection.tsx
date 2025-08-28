import { useState, useEffect } from 'react'
import { ILaptopQuery } from '../models/LaptopQuery'

export default function ResolvedSection() {
  const [resolvedQueries, setResolvedQueries] = useState<ILaptopQuery[]>([])
  const [filteredQueries, setFilteredQueries] = useState<ILaptopQuery[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'not_resolved'>('all')
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [queryToDelete, setQueryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchResolvedQueries()
  }, [])

  const fetchResolvedQueries = async () => {
    try {
      const response = await fetch('/api/queries/resolved')
      const data = await response.json()
      
      if (data.success) {
        setResolvedQueries(data.data)
        setFilteredQueries(data.data)
      }
    } catch (error) {
      console.error('Error fetching resolved queries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add search and filter effects
  useEffect(() => {
    let filtered = resolvedQueries

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(query => query.status === statusFilter)
    }

    // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        filtered = filtered.filter(query => 
          query.name.toLowerCase().includes(searchLower) ||
          query.laptopName.toLowerCase().includes(searchLower) ||
          query.model.toLowerCase().includes(searchLower) ||
          query.issue.toLowerCase().includes(searchLower) ||
          query.contactInfo?.toLowerCase().includes(searchLower) ||
          query.resolvedBy?.toLowerCase().includes(searchLower) ||
          query.resolution?.toLowerCase().includes(searchLower)
        )
      }    setFilteredQueries(filtered)
  }, [resolvedQueries, searchTerm, statusFilter])

  const handleDeleteQuery = (queryId: string) => {
    setQueryToDelete(queryId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!queryToDelete) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/queries/${queryToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the deleted query from both arrays
        setResolvedQueries(prev => prev.filter(query => query._id !== queryToDelete))
        setFilteredQueries(prev => prev.filter(query => query._id !== queryToDelete))
        setShowDeleteDialog(false)
        setQueryToDelete(null)
      } else {
        console.error('Failed to delete query')
      }
    } catch (error) {
      console.error('Error deleting query:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteDialog(false)
    setQueryToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') {
      return (
        <span className="status-badge status-resolved">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Resolved
        </span>
      )
    } else {
      return (
        <span className="status-badge status-not-resolved">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Not Resolved
        </span>
      )
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading resolved queries...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-purple-500/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Resolved Queries</h2>
          <p className="text-gray-600 font-medium">View completed repair requests and their outcomes</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-gradient-to-r from-white/60 to-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, device, model, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 bg-white/60 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'resolved' | 'not_resolved')}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 bg-white/60 backdrop-blur-sm text-gray-700"
              >
                <option value="all">All Status</option>
                <option value="resolved">Resolved Only</option>
                <option value="not_resolved">Not Resolved Only</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center lg:w-32">
              <span className="text-sm font-semibold text-gray-600 bg-white/80 px-4 py-3 rounded-xl border border-gray-200/50">
                {filteredQueries.length} result{filteredQueries.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {resolvedQueries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No resolved queries yet</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto">Resolved queries will appear here once you start processing repairs</p>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No matches found</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueries.map((query) => (
              <div key={query._id} className="card-compact group hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      query.status === 'resolved' 
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                        : 'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}></div>
                    <h3 className="font-bold text-lg text-gray-900 truncate">{query.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(query.status)}
                    <button
                      onClick={() => handleDeleteQuery(query._id!)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:visible opacity-0 group-hover:opacity-100"
                      title="Delete query"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Device</span>
                      <p className="text-sm font-semibold text-gray-900 truncate">{query.laptopName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Model</span>
                      <p className="text-sm font-semibold text-gray-900 truncate">{query.model}</p>
                    </div>
                  </div>

                  {query.contactInfo && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</span>
                        <p className="text-sm font-semibold text-gray-900 truncate">{query.contactInfo}</p>
                      </div>
                    </div>
                  )}

                  {query.priority && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          query.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          query.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          query.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {query.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Issue</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {query.issue}
                    </p>
                  </div>
                </div>

                {query.resolution && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolution</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <p className="text-sm text-green-800 line-clamp-3 leading-relaxed">
                        {query.resolution}
                      </p>
                    </div>
                  </div>
                )}

                {query.resolvedBy && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolved By</span>
                      <span className="text-sm font-semibold text-blue-600">{query.resolvedBy}</span>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                    <div>
                      <span className="block font-medium text-gray-500 mb-1">Submitted</span>
                      <span className="text-gray-700">{new Date(query.createdAt!).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-gray-500 mb-1">Resolved</span>
                      <span className="text-gray-700">{new Date(query.updatedAt!).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {(query.estimatedCost || query.actualCost) && (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {query.estimatedCost && (
                        <div>
                          <span className="block font-medium text-gray-500 mb-1">Estimated Cost</span>
                          <span className="text-gray-700">₹{query.estimatedCost}</span>
                        </div>
                      )}
                      {query.actualCost && (
                        <div>
                          <span className="block font-medium text-gray-500 mb-1">Actual Cost</span>
                          <span className="text-green-600 font-semibold">₹{query.actualCost}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover effect decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Query</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this query? This action cannot be undone and all associated data will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}