import * as jwt from 'jsonwebtoken'
import { loadEnv } from '@packages/config'

export interface AccessTokenPayload {
  sub: string
  isAdmin: boolean
  ratingLevel: number
}

export interface RefreshTokenPayload {
  sub: string
}

export interface TokenService {
  issueAccessToken(payload: AccessTokenPayload): string
  issueRefreshToken(payload: RefreshTokenPayload): string
  verifyAccessToken(token: string): AccessTokenPayload
  verifyRefreshToken(token: string): RefreshTokenPayload
}

export class JwtTokenService implements TokenService {
  private accessTtl: string
  private refreshTtl: string
  private secret: string

  constructor() {
    const env = loadEnv()
    this.accessTtl = env.ACCESS_TOKEN_TTL
    this.refreshTtl = env.REFRESH_TOKEN_TTL
    this.secret = env.JWT_SECRET
  }

  issueAccessToken(payload: AccessTokenPayload): string {
    return (jwt as any).sign(payload, this.secret, { expiresIn: this.accessTtl }) as string
  }
  issueRefreshToken(payload: RefreshTokenPayload): string {
    return (jwt as any).sign(payload, this.secret, { expiresIn: this.refreshTtl }) as string
  }
  verifyAccessToken(token: string): AccessTokenPayload {
    return (jwt as any).verify(token, this.secret) as any
  }
  verifyRefreshToken(token: string): RefreshTokenPayload {
    return (jwt as any).verify(token, this.secret) as any
  }
}

