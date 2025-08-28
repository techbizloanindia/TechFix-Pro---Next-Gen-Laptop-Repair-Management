import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import LaptopQuery from '../../../models/LaptopQuery'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const pendingQueries = await LaptopQuery.find({ status: 'pending' }).sort({ createdAt: -1 })
        res.status(200).json({ success: true, data: pendingQueries })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' })
      break
  }
}