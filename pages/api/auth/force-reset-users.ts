import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  await dbConnect()

  try {
    console.log('🗑️ Clearing all existing users...')
    await User.deleteMany({})
    
    console.log('👥 Creating fresh users with proper password hashing...')
    
    // Create users manually with proper password hashing
    const users = [
      { username: 'Mr.Jagrit', password: 'Jagrit@1234', name: 'Jagrit Madan' },
      { username: 'Mr.Aashish', password: 'Aashish@1234', name: 'Aashish Srivastava' },
      { username: 'Mr.Chandrakant', password: 'Chandrakant@1234', name: 'Chandra Kant' },
      { username: 'Mr.Nitish', password: 'Nitish@1234', name: 'Nitish Kumar' }
    ];

    const createdUsers = [];

    for (const userData of users) {
      console.log(`Creating user: ${userData.username} → ${userData.name}`);
      
      // Hash password manually
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      console.log(`   • Original password: ${userData.password}`);
      console.log(`   • Hashed password: ${hashedPassword.substring(0, 20)}...`);
      
      // Create user directly in database
      const user = new User({
        username: userData.username,
        password: hashedPassword, // Use pre-hashed password
        name: userData.name
      });
      
      // Save without triggering pre-save hook (since we already hashed)
      await user.save({ validateBeforeSave: true });
      
      // Test the password immediately
      const testCompare = await bcrypt.compare(userData.password, hashedPassword);
      console.log(`   • Password verification test: ${testCompare ? 'PASS' : 'FAIL'}`);
      
      createdUsers.push({
        username: userData.username,
        name: userData.name,
        passwordTest: testCompare
      });
    }

    console.log('✅ All users created successfully');

    res.status(200).json({
      success: true,
      message: 'Users force reset with manual password hashing',
      users: createdUsers
    });

  } catch (error) {
    console.error('❌ Force reset error:', error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
  }
}