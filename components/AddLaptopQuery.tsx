import React, { useState } from 'react'

interface AddLaptopQueryProps {
  onQueryAdded: () => void
}

const AddLaptopQuery: React.FC<AddLaptopQueryProps> = ({ onQueryAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    laptopName: '',
    model: '',
    issue: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const submitData = {
        ...formData,
        status: 'pending'
      }

      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Query submitted successfully!' })
        setFormData({
          name: '',
          laptopName: '',
          model: '',
          issue: ''
        })
        onQueryAdded()
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Failed to submit query')
      }
    } catch (error) {
      console.error('Error submitting query:', error)
      setMessage({ type: 'error', text: 'Failed to submit query. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Submit New Repair Request</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm shadow-sm"
              placeholder="Enter customer name"
            />
          </div>

          {/* Laptop Name */}
          <div>
            <label htmlFor="laptopName" className="block text-sm font-medium text-gray-800 mb-2">
              Laptop Name *
            </label>
            <input
              type="text"
              id="laptopName"
              name="laptopName"
              value={formData.laptopName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm shadow-sm"
              placeholder="e.g., Dell, HP, Lenovo"
            />
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-800 mb-2">
              Model *
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm shadow-sm"
              placeholder="e.g., XPS 13, ThinkPad X1"
            />
          </div>
        </div>

        {/* Issue Description */}
        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-gray-800 mb-2">
            Issue Description *
          </label>
          <textarea
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm resize-none shadow-sm"
            placeholder="Describe the laptop issue in detail..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Submit Request</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddLaptopQuery
