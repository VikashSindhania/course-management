import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from './mongodb'
import User from './models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(request: NextRequest) {
  try {
    await connectDB()
    const token = request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await User.findById(payload.userId).select('_id email name role')

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

