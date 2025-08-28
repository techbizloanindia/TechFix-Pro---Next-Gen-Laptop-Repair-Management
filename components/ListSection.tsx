import { useState, useEffect } from 'react'
import { ILaptopQuery } from '../models/LaptopQuery'

interface ListSectionProps {
  onQueryUpdated: () => void
}

interface ResolveDialogData {
  queryId: string
  status: 'resolved' | 'not_resolved'
  resolvedBy: string
  resolution: string
  actualCost: string
}

export default function ListSection({ onQueryUpdated }: ListSectionProps) {
  const [queries, setQueries] = useState<ILaptopQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const [resolveDialogData, setResolveDialogData] = useState<ResolveDialogData>({
    queryId: '',
    status: 'resolved',
    resolvedBy: '',
    resolution: '',
    actualCost: ''
  })

  useEffect(() => {
    fetchPendingQueries()
  }, [])

  const fetchPendingQueries = async () => {
    try {
      const response = await fetch('/api/queries/pending')
      const data = await response.json()
      
      if (data.success) {
        setQueries(data.data)
      }
    } catch (error) {
      console.error('Error fetching pending queries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (queryId: string, status: 'resolved' | 'not_resolved') => {
    if (status === 'resolved') {
      // Open dialog for resolved queries
      setResolveDialogData({
        queryId,
        status,
        resolvedBy: '',
        resolution: '',
        actualCost: ''
      })
      setShowResolveDialog(true)
    } else {
      // Handle not resolved directly
      await updateQueryStatus(queryId, status, {})
    }
  }

  const updateQueryStatus = async (queryId: string, status: 'resolved' | 'not_resolved', additionalData: any) => {
    try {
      const response = await fetch(`/api/queries/${queryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          ...additionalData,
          updatedAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        // Remove the query from the list since it's no longer pending
        setQueries(queries.filter(q => q._id !== queryId))
        onQueryUpdated()
        setShowResolveDialog(false)
      }
    } catch (error) {
      console.error('Error updating query status:', error)
    }
  }

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateQueryStatus(resolveDialogData.queryId, resolveDialogData.status, {
      resolvedBy: resolveDialogData.resolvedBy,
      resolution: resolveDialogData.resolution,
      actualCost: resolveDialogData.actualCost ? parseFloat(resolveDialogData.actualCost) : undefined
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-violet-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-violet-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading queries...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto fade-in-up">
      <div className="card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-blue-500/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Pending Queries</h2>
          <p className="text-gray-600 font-medium">Review and resolve pending repair requests</p>
        </div>
        
        {queries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No pending queries</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto">All queries have been processed. New submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {queries.map((query) => (
              <div key={query._id} className="card-compact hover:scale-[1.01] transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Query Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{query.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{query.laptopName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="font-medium">{query.model}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{new Date(query.createdAt!).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                          {query.contactInfo && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{query.contactInfo}</span>
                            </div>
                          )}
                          {query.priority && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className={`font-medium px-2 py-1 rounded text-xs ${
                                query.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                query.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                query.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {query.priority?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          {query.estimatedCost && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="font-medium">₹{query.estimatedCost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="status-badge status-pending">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Issue Description</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{query.issue}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => handleStatusUpdate(query._id!, 'resolved')}
                      className="btn btn-success flex items-center justify-center space-x-2 flex-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Mark Resolved</span>
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate(query._id!, 'not_resolved')}
                      className="btn btn-danger flex items-center justify-center space-x-2 flex-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Not Resolved</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Dialog */}
      {showResolveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Resolve Query</h3>
                <button
                  onClick={() => setShowResolveDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleResolveSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <span>Resolved By</span>
                  </label>
                  <input
                    type="text"
                    value={resolveDialogData.resolvedBy}
                    onChange={(e) => setResolveDialogData(prev => ({ ...prev, resolvedBy: e.target.value }))}
                    className="input"
                    placeholder="Technician name"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span>Resolution Details</span>
                  </label>
                  <textarea
                    value={resolveDialogData.resolution}
                    onChange={(e) => setResolveDialogData(prev => ({ ...prev, resolution: e.target.value }))}
                    className="textarea"
                    rows={3}
                    placeholder="Describe what was done to resolve the issue..."
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span>Actual Cost in INR (Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={resolveDialogData.actualCost}
                    onChange={(e) => setResolveDialogData(prev => ({ ...prev, actualCost: e.target.value }))}
                    className="input"
                    placeholder="Final repair cost in INR"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResolveDialog(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}