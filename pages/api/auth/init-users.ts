import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  await dbConnect()

  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments()
    if (existingUsers > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Users already initialized' 
      })
    }

    // Create default users
    const defaultUsers = [
      {
        username: 'Mr.Jagrit',
        password: 'Jagrit@1234',
        name: 'Jagrit Madan'
      },
      {
        username: 'Mr.Aashish',
        password: 'Aashish@1234',
        name: 'Aashish Srivastava'
      },
      {
        username: 'Mr.Chandrakant',
        password: 'Chandrakant@1234',
        name: 'Chandra Kant'
      },
      {
        username: 'Mr.Nitish',
        password: 'Nitish@1234',
        name: 'Nitish Kumar'
      }
    ]

    await User.insertMany(defaultUsers)

    res.status(200).json({
      success: true,
      message: 'Default users created successfully',
      count: defaultUsers.length
    })
  } catch (error) {
    console.error('Init users error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}