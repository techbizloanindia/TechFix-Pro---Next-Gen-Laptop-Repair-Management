import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const token = req.cookies['auth-token']
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    res.status(200).json({
      success: true,
      user: {
        id: decoded.userId,
        username: decoded.username,
        name: decoded.name
      }
    })
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}