import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    console.log('🔍 Checking database status...')
    
    // Test database connection
    await dbConnect()
    console.log('✅ Database connected successfully')

    // Count users
    const userCount = await User.countDocuments()
    console.log('👥 Total users in database:', userCount)

    // Get all users (without passwords)
    const users = await User.find({}).select('-password')
    console.log('📋 Users in database:', users.map(u => ({ username: u.username, name: u.name })))

    res.status(200).json({
      success: true,
      database: {
        connected: true,
        userCount: userCount,
        users: users.map(u => ({
          id: u._id,
          username: u.username,
          name: u.name,
          createdAt: u.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('❌ Database status error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}