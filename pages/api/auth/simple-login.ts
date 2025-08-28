import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Direct connection function
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laptop-repair-management'
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI)
  }
  return mongoose.connection
}

// Simple User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🚀 Simple login API called')
  console.log('Method:', req.method)
  console.log('Body:', req.body)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      console.log('❌ Missing credentials')
      return res.status(400).json({ success: false, message: 'Username and password required' })
    }
    
    console.log('🔗 Connecting to database...')
    await connectDB()
    console.log('✅ Database connected')
    
    console.log('👤 Looking for user:', username)
    const user = await User.findOne({ username: username })
    
    if (!user) {
      console.log('❌ User not found')
      
      // Show available users for debugging
      const allUsers = await User.find({})
      console.log('Available users:', allUsers.map(u => u.username))
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials',
        debug: { availableUsers: allUsers.map(u => u.username) }
      })
    }
    
    console.log('✅ User found:', user.username)
    console.log('Password hash length:', user.password.length)
    
    console.log('🔒 Testing password...')
    const isValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValid)
    
    if (!isValid) {
      console.log('❌ Invalid password')
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    
    console.log('✅ Login successful for:', user.name)
    
    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
    const token = jwt.sign(
      { userId: user._id, username: user.username, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Set cookie
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        name: user.name
      }
    })
    
  } catch (error) {
    console.error('❌ Simple login error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}