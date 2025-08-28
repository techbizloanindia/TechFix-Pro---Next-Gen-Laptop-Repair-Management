import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  await dbConnect()

  try {
    // Clear existing users
    await User.deleteMany({})
    console.log('🗑️ Cleared existing users')

    // Create updated users with correct names
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
    console.log('✅ Created updated users with correct names')

    res.status(200).json({
      success: true,
      message: 'Users reset successfully with correct names',
      users: defaultUsers.map(user => ({ username: user.username, name: user.name }))
    })
  } catch (error) {
    console.error('Reset users error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}