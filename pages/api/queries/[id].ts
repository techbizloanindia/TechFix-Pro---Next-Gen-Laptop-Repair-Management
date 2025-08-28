import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/mongoose'
import LaptopQuery from '../../../models/LaptopQuery'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const query = await LaptopQuery.findById(id)
        if (!query) {
          return res.status(404).json({ success: false, message: 'Query not found' })
        }
        res.status(200).json({ success: true, data: query })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    case 'PUT':
      try {
        const query = await LaptopQuery.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!query) {
          return res.status(404).json({ success: false, message: 'Query not found' })
        }
        res.status(200).json({ success: true, data: query })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    case 'DELETE':
      try {
        const deletedQuery = await LaptopQuery.deleteOne({ _id: id })
        if (!deletedQuery.deletedCount) {
          return res.status(404).json({ success: false, message: 'Query not found' })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
      break

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' })
      break
  }
}