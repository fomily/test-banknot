import 'dotenv/config'
import path from 'path'
// programmatic module-alias mapping for runtime
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleAlias = require('module-alias')
moduleAlias.addAliases({
  '@core': path.resolve(__dirname, '../../..', 'packages/core/dist'),
  '@api': path.resolve(__dirname, '../../..', 'packages/api/dist'),
})
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import * as jwt from 'jsonwebtoken'
import { RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase, LogoutUserUseCase } from '@core/use-cases'
import type { PasswordHasherPort, TokenServicePort, UserRepositoryPort, WalletRepositoryPort } from '@core/ports'
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

const app = express()

// Trust reverse proxy (needed for Secure cookies behind proxy)
app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// CORS: may be disabled when all traffic is strictly same-origin via reverse proxy
const disableCors = process.env.DISABLE_CORS === 'true'
if (!disableCors) {
  // CORS whitelist from env (comma-separated origins)
  const corsOriginsEnv = process.env.CORS_ORIGINS || ''
  const allowedOrigins = corsOriginsEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  // If no explicit list provided, allow same-origin requests (no origin) and common localhost defaults
  const defaultLocalhosts = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
  ])

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        if (allowedOrigins.length === 0 && defaultLocalhosts.has(origin)) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
}

// Rate limit (enabled only in production)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use(limiter)
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Swagger placeholder
app.get('/docs', (_req, res) => {
  res.status(200).send('<html><body><h1>API Docs</h1><p>Swagger will be here.</p></body></html>')
})

// ---- Auth wiring (step 3) ----
const prisma = new PrismaClient()

// Adapters: repositories
class PrismaUserRepository implements UserRepositoryPort {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } }) as unknown as Awaited<ReturnType<UserRepositoryPort['findByEmail']>>
  }
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } }) as unknown as Awaited<ReturnType<UserRepositoryPort['findById']>>
  }
  async isEmailTaken(email: string) {
    const u = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    return Boolean(u)
  }
  async create(params: { email: string; passwordHash: string; firstName: string; lastName: string; middleName?: string | null }) {
    const user = await prisma.user.create({
      data: {
        email: params.email,
        passwordHash: params.passwordHash,
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName ?? null,
      },
    })
    return user as unknown as Awaited<ReturnType<UserRepositoryPort['create']>>
  }
}

class PrismaWalletRepository implements WalletRepositoryPort {
  async createForUser(userId: string) {
    const w = await prisma.wallet.create({ data: { userId } })
    return w as unknown as Awaited<ReturnType<WalletRepositoryPort['createForUser']>>
  }
}

// Services
import bcrypt from 'bcryptjs'
class BcryptPasswordHasher implements PasswordHasherPort {
  async hash(plain: string) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(plain, salt)
  }
  async verify(hash: string, plain: string) {
    return bcrypt.compare(plain, hash)
  }
}

class JwtTokenService implements TokenServicePort {
  private accessTtl = process.env.ACCESS_TOKEN_TTL || '15m'
  private refreshTtl = process.env.REFRESH_TOKEN_TTL || '7d'
  private secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  issueAccessToken(payload: { sub: string; isAdmin: boolean; ratingLevel: number }): string {
    return (jwt as any).sign(payload, this.secret, { expiresIn: this.accessTtl }) as string
  }
  issueRefreshToken(payload: { sub: string }): string {
    return (jwt as any).sign(payload, this.secret, { expiresIn: this.refreshTtl }) as string
  }
  verifyAccessToken(token: string): { sub: string; isAdmin: boolean; ratingLevel: number } {
    return (jwt as any).verify(token, this.secret) as any
  }
  verifyRefreshToken(token: string): { sub: string } {
    return (jwt as any).verify(token, this.secret) as any
  }
}

// Instantiate dependencies for use-cases
const tokenService: TokenServicePort = new JwtTokenService()
const passwordHasher: PasswordHasherPort = new BcryptPasswordHasher()
const userRepository: UserRepositoryPort = new PrismaUserRepository()
const walletRepository: WalletRepositoryPort = new PrismaWalletRepository()

// Helpers
const cookieName = process.env.COOKIE_NAME_REFRESH || 'refreshToken'
const cookiePath = process.env.COOKIE_PATH_REFRESH || '/auth/refresh'
const cookieDomain = process.env.COOKIE_DOMAIN
const cookieSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production'
const sameSite = (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax'

const setRefreshCookie = (res: express.Response, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: sameSite === 'none' ? 'none' : sameSite,
    domain: cookieDomain,
    path: cookiePath,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

const clearRefreshCookie = (res: express.Response) => {
  res.clearCookie(cookieName, { domain: cookieDomain, path: cookiePath })
}

// Routes
app.post('/auth/register', async (req, res, next) => {
  try {
    const useCase = new RegisterUserUseCase(userRepository, walletRepository, passwordHasher, tokenService)
    const { email, password } = req.body as { email: string; password: string }
    const result = await useCase.execute({ email, password })
    setRefreshCookie(res, result.refreshToken)
    res.status(200).json({ accessToken: result.accessToken })
  } catch (e) {
    next(e)
  }
})

app.post('/auth/login', async (req, res, next) => {
  try {
    const useCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService)
    const { email, password } = req.body as { email: string; password: string }
    const result = await useCase.execute({ email, password })
    setRefreshCookie(res, result.refreshToken)
    res.status(200).json({ accessToken: result.accessToken })
  } catch (e) {
    next(e)
  }
})

app.post('/auth/refresh', async (req, res, _next) => {
  const token = req.cookies?.[cookieName]
  if (!token) return res.status(401).json({ error: { message: 'No refresh token' } })
  try {
    const useCase = new RefreshTokenUseCase(tokenService, userRepository)
    const result = await useCase.execute({ refreshToken: token })
    setRefreshCookie(res, result.refreshToken)
    return res.status(200).json({ accessToken: result.accessToken })
  } catch (_err) {
    clearRefreshCookie(res)
    return res.status(401).json({ error: { message: 'Invalid refresh token' } })
  }
})

app.post('/auth/logout', async (_req, res, next) => {
  try {
    new LogoutUserUseCase()
    clearRefreshCookie(res)
    res.status(200).json({ success: true })
  } catch (e) {
    next(e)
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found', path: req.path } })
})

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const isProd = process.env.NODE_ENV === 'production'
  const message = err instanceof Error ? err.message : 'Internal Server Error'
  const status = 500
  res.status(status).json({
    error: {
      message,
      ...(isProd ? {} : { details: String(err) }),
    },
  })
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`)
})
