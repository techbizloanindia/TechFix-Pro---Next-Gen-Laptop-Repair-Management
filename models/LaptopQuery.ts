import mongoose from 'mongoose'

export interface ILaptopQuery {
  _id?: string
  name: string
  laptopName: string
  model: string
  issue: string
  contactInfo?: string
  status: 'pending' | 'resolved' | 'not_resolved'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  estimatedCost?: number
  actualCost?: number
  resolvedBy?: string
  resolution?: string
  createdAt?: Date
  updatedAt?: Date
}

const LaptopQuerySchema = new mongoose.Schema<ILaptopQuery>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  laptopName: {
    type: String,
    required: [true, 'Laptop name is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  issue: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true
  },
  contactInfo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'not_resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimatedCost: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  resolvedBy: {
    type: String,
    trim: true
  },
  resolution: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

export default mongoose.models.LaptopQuery || mongoose.model<ILaptopQuery>('LaptopQuery', LaptopQuerySchema)