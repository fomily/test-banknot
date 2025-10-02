import { Request, Response, NextFunction } from 'express'
import { JwtTokenService } from '@packages/security'

const tokenService = new JwtTokenService()

export interface AuthRequest extends Request {
  userId?: string
  isAdmin?: boolean
  ratingLevel?: number
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Unauthorized' } })
  }

  const token = authHeader.substring(7)
  try {
    const payload = tokenService.verifyAccessToken(token)
    req.userId = payload.sub
    req.isAdmin = payload.isAdmin || false
    req.ratingLevel = payload.ratingLevel || 3
    next()
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid token' } })
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: { message: 'Forbidden' } })
  }
  next()
}

