import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    console.log('🔗 Connecting to MongoDB...')
    await dbConnect()
    console.log('✅ MongoDB connected successfully')

    const { username, password } = req.body
    console.log('🔐 Login attempt for username:', username)

    if (!username || !password) {
      console.log('❌ Missing username or password')
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      })
    }

    // Find user and explicitly select password
    console.log('👤 Searching for user:', username)
    const user = await User.findOne({ username }).select('+password')
    console.log('📊 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      console.log('❌ User not found:', username)
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      })
    }

    // Check password
    console.log('🔒 Validating password...')
    const isPasswordValid = await user.comparePassword(password)
    console.log('🔑 Password valid:', isPasswordValid ? 'Yes' : 'No')
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', username)
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      })
    }

    // Generate JWT token
    console.log('🎫 Generating JWT token...')
    const token = jwt.sign(
      { userId: user._id, username: user.username, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)
    console.log('🍪 Auth cookie set successfully')

    console.log('✅ Login successful for:', user.name, '(', user.username, ')')
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        name: user.name
      }
    })
  } catch (error) {
    console.error('❌ Login error:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    res.status(500).json({ success: false, message: 'Server error' })
  }
}