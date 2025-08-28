import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import LaptopQuery from '../../../models/LaptopQuery'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const resolvedQueries = await LaptopQuery.find({ 
          status: { $in: ['resolved', 'not_resolved'] } 
        }).sort({ updatedAt: -1 })
        res.status(200).json({ success: true, data: resolvedQueries })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' })
      break
  }
}