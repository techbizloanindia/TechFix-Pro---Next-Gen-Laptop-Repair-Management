import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

// Direct connection function
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laptop-repair-management'
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI)
  }
  return mongoose.connection
}

// User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    console.log('🔍 Detailed user inspection starting...')
    
    // Connect to database
    await connectDB()
    console.log('✅ Connected to MongoDB')
    
    // Get all users with password info (for length check only)
    const users = await User.find({}).select('+password')
    console.log(`📊 Found ${users.length} users in database`)
    
    const detailedUsers = users.map((user, index) => {
      console.log(`👤 User ${index + 1}:`)
      console.log(`   Username: ${user.username}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Password Hash Length: ${user.password ? user.password.length : 'No password'}`)
      console.log(`   Password Hash Preview: ${user.password ? user.password.substring(0, 20) + '...' : 'None'}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log(`   Updated: ${user.updatedAt}`)
      
      return {
        id: user._id,
        username: user.username,
        name: user.name,
        hasPassword: !!user.password,
        passwordHashLength: user.password ? user.password.length : 0,
        passwordHashPreview: user.password ? user.password.substring(0, 20) + '...' : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isValidBcryptHash: user.password ? user.password.startsWith('$2') : false
      }
    })
    
    // Database collection info
    const dbName = mongoose.connection.db?.databaseName || 'unknown'
    const collectionName = User.collection.collectionName
    const documentCount = await User.countDocuments()
    
    console.log(`📁 Database: ${dbName}`)
    console.log(`📂 Collection: ${collectionName}`)
    console.log(`📋 Document Count: ${documentCount}`)
    
    res.status(200).json({
      success: true,
      database: {
        name: dbName,
        collection: collectionName,
        stats: {
          documentCount: documentCount,
          dataSize: 0,
          storageSize: 0
        }
      },
      users: detailedUsers,
      summary: {
        totalUsers: users.length,
        usersWithPassword: detailedUsers.filter(u => u.hasPassword).length,
        validBcryptHashes: detailedUsers.filter(u => u.isValidBcryptHash).length
      },
      expectedCredentials: [
        { username: 'Mr.Jagrit', expectedPassword: 'Jagrit@1234', expectedName: 'Jagrit Madan' },
        { username: 'Mr.Aashish', expectedPassword: 'Aashish@1234', expectedName: 'Aashish Srivastava' },
        { username: 'Mr.Chandrakant', expectedPassword: 'Chandrakant@1234', expectedName: 'Chandra Kant' },
        { username: 'Mr.Nitish', expectedPassword: 'Nitish@1234', expectedName: 'Nitish Kumar' }
      ]
    })
    
  } catch (error) {
    console.error('❌ Detailed user inspection error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Database inspection failed',
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}