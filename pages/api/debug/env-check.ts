import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const env = {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
  }

  console.log('🔍 Environment check:')
  console.log('   MONGODB_URI:', env.MONGODB_URI)
  console.log('   JWT_SECRET:', env.JWT_SECRET)
  console.log('   NODE_ENV:', env.NODE_ENV)

  res.status(200).json({
    success: true,
    environment: env,
    warnings: [
      env.MONGODB_URI === 'Not set' ? 'MONGODB_URI not set' : null,
      env.JWT_SECRET === 'Not set' ? 'JWT_SECRET not set' : null
    ].filter(Boolean)
  })
}