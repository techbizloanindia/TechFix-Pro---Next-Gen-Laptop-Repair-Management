import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Direct MongoDB connection without using lib
async function connectDirectly() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laptop-repair-management'
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Direct MongoDB connection established')
  }
  return mongoose.connection
}

// Create User schema directly
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { timestamps: true })

// Ensure model is created fresh
delete mongoose.models.User
const User = mongoose.model('User', UserSchema)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    console.log('🔄 Starting complete reset...')
    
    // Connect directly to MongoDB
    await connectDirectly()
    console.log('✅ Connected to MongoDB')
    
    // Drop the users collection entirely
    try {
      await User.collection.drop()
      console.log('🗑️ Dropped existing users collection')
    } catch (error) {
      console.log('ℹ️ Users collection didn\'t exist or was already empty')
    }
    
    // Create users with manual password hashing
    const userData = [
      { username: 'Mr.Jagrit', password: 'Jagrit@1234', name: 'Jagrit Madan' },
      { username: 'Mr.Aashish', password: 'Aashish@1234', name: 'Aashish Srivastava' },
      { username: 'Mr.Chandrakant', password: 'Chandrakant@1234', name: 'Chandra Kant' },
      { username: 'Mr.Nitish', password: 'Nitish@1234', name: 'Nitish Kumar' }
    ]
    
    const createdUsers = []
    
    for (const user of userData) {
      console.log(`👤 Creating user: ${user.username}`)
      
      // Hash password manually
      const hashedPassword = await bcrypt.hash(user.password, 12)
      console.log(`   • Password hash: ${hashedPassword.substring(0, 20)}...`)
      
      // Create and save user
      const newUser = new User({
        username: user.username,
        password: hashedPassword,
        name: user.name
      })
      
      await newUser.save()
      console.log(`   • Saved to database`)
      
      // Immediately test password
      const testUser = await User.findOne({ username: user.username })
      const passwordTest = testUser ? await bcrypt.compare(user.password, testUser.password) : false
      console.log(`   • Password test: ${passwordTest ? 'PASS ✅' : 'FAIL ❌'}`)
      
      createdUsers.push({
        username: user.username,
        name: user.name,
        originalPassword: user.password,
        passwordTest: passwordTest
      })
    }
    
    console.log('🎉 Complete reset finished')
    
    res.status(200).json({
      success: true,
      message: 'Complete reset successful',
      users: createdUsers,
      totalUsers: createdUsers.length,
      allPasswordsWork: createdUsers.every(u => u.passwordTest)
    })
    
  } catch (error) {
    console.error('❌ Complete reset error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Reset failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}