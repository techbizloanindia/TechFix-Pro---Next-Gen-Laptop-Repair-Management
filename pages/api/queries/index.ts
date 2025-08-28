import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import LaptopQuery from '../../../models/LaptopQuery'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const { status } = req.query
        let filter = {}
        
        if (status && status !== 'all') {
          filter = { status }
        }

        const queries = await LaptopQuery.find(filter).sort({ createdAt: -1 })
        res.status(200).json({ success: true, data: queries })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    case 'POST':
      try {
        const query = await LaptopQuery.create({
          ...req.body,
          status: 'pending'
        })
        res.status(201).json({ success: true, data: query })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' })
      break
  }
}