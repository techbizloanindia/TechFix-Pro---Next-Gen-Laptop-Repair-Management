import type { NextApiRequest, NextApiResponse } from 'next'

// This endpoint will try multiple login methods
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { username, password } = req.body
  console.log('🔄 Backup login attempting for:', username)

  // Try different login endpoints in order
  const loginEndpoints = [
    '/api/auth/login',
    '/api/auth/simple-login'
  ]

  for (const endpoint of loginEndpoints) {
    try {
      console.log(`🧪 Trying endpoint: ${endpoint}`)
      
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ Success with endpoint: ${endpoint}`)
        
        // Forward the successful response
        if (data.user) {
          // Set the same cookie if it was set by the successful endpoint
          const cookie = response.headers.get('set-cookie')
          if (cookie) {
            res.setHeader('Set-Cookie', cookie)
          }
        }
        
        return res.status(200).json(data)
      } else {
        console.log(`❌ Failed with endpoint: ${endpoint} - ${data.message}`)
      }

    } catch (error) {
      console.log(`❌ Error with endpoint: ${endpoint} - ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // If all methods failed
  console.log('❌ All login methods failed')
  return res.status(401).json({
    success: false,
    message: 'All login methods failed'
  })
}