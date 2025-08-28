import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    console.log('✅ Database connected for debug test')

    const { username, password } = req.body
    console.log('🧪 Testing login for:', username, 'with password:', password)

    // Find user with password
    const user = await User.findOne({ username }).select('+password')
    console.log('👤 User found:', user ? 'Yes' : 'No')

    if (!user) {
      console.log('❌ User not found in database')
      
      // Let's see what users actually exist
      const allUsers = await User.find({}).select('username name')
      console.log('📋 Available users in database:')
      allUsers.forEach(u => console.log(`   • ${u.username} → ${u.name}`))
      
      return res.status(404).json({
        success: false,
        message: 'User not found',
        availableUsers: allUsers.map(u => ({ username: u.username, name: u.name }))
      })
    }

    console.log('📊 User details:')
    console.log('   • ID:', user._id)
    console.log('   • Username:', user.username)
    console.log('   • Name:', user.name)
    console.log('   • Password hash length:', user.password.length)
    console.log('   • Password hash starts with:', user.password.substring(0, 10))

    // Test password comparison
    console.log('🔒 Testing password comparison...')
    console.log('   • Input password:', password)
    console.log('   • Hash from DB:', user.password)

    // Direct bcrypt compare
    const directCompare = await bcrypt.compare(password, user.password)
    console.log('   • Direct bcrypt.compare result:', directCompare)

    // Method compare
    const methodCompare = await user.comparePassword(password)
    console.log('   • Method comparePassword result:', methodCompare)

    // Test with manual hash
    const manualHash = await bcrypt.hash(password, 12)
    console.log('   • Manual hash of input:', manualHash)
    const manualCompare = await bcrypt.compare(password, manualHash)
    console.log('   • Manual hash compare result:', manualCompare)

    res.status(200).json({
      success: true,
      debug: {
        userFound: true,
        username: user.username,
        name: user.name,
        passwordHashLength: user.password.length,
        directBcryptCompare: directCompare,
        methodCompare: methodCompare,
        manualTest: manualCompare
      }
    })

  } catch (error) {
    console.error('❌ Debug test error:', error)
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
  }
}