import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Declare global type for mongoose caching
declare global {
  var mongoose: {
    conn: any
    promise: Promise<any> | null
  } | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    }

    if (cached) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
    }
  }

  try {
    if (cached) {
      cached.conn = await cached.promise
    }
    console.log('📊 MongoDB connection status: Connected')
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e)
    if (cached) {
      cached.promise = null
    }
    throw e
  }

  return cached?.conn
}

export default dbConnect