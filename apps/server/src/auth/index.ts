import { Router } from 'express'
import { getPrisma } from '../prisma'
import { BcryptPasswordHasher, JwtTokenService } from '@packages/security'
import { loadEnv } from '@packages/config'

export const authRouter = Router()

const prisma = getPrisma()
const tokenService = new JwtTokenService()
const passwordHasher = new BcryptPasswordHasher()

const env = loadEnv()
const cookieName = env.COOKIE_NAME_REFRESH
const cookiePath = env.COOKIE_PATH_REFRESH
const cookieDomain = env.COOKIE_DOMAIN
const cookieSecure = env.COOKIE_SECURE === 'true' || env.NODE_ENV === 'production'
const sameSite = (env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax'

const setRefreshCookie = (res: import('express').Response, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: sameSite === 'none' ? 'none' : sameSite,
    domain: cookieDomain,
    path: cookiePath,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

const clearRefreshCookie = (res: import('express').Response) => {
  res.clearCookie(cookieName, { domain: cookieDomain, path: cookiePath })
}

// Inline use-cases for now (minimalist style)
async function registerUser(params: { email: string; password: string }) {
  const isTaken = await prisma.user.findUnique({ where: { email: params.email }, select: { id: true } })
  if (isTaken) throw new Error('Email already registered')
  const passwordHash = await passwordHasher.hash(params.password)
  const user = await prisma.user.create({
    data: {
      email: params.email,
      passwordHash,
      firstName: 'Имя',
      lastName: 'Фамилия',
      ratingLevel: 3,
    },
  })
  await prisma.wallet.create({ data: { userId: user.id } })
  const accessToken = tokenService.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel })
  const refreshToken = tokenService.issueRefreshToken({ sub: user.id })
  return { accessToken, refreshToken }
}

async function loginUser(params: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: params.email } })
  if (!user) throw new Error('Invalid credentials')
  const ok = await passwordHasher.verify(user.passwordHash, params.password)
  if (!ok) throw new Error('Invalid credentials')
  const accessToken = tokenService.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel })
  const refreshToken = tokenService.issueRefreshToken({ sub: user.id })
  return { accessToken, refreshToken }
}

async function refreshTokenUseCase(refreshToken: string) {
  const payload = tokenService.verifyRefreshToken(refreshToken)
  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user) throw new Error('Invalid refresh token')
  const accessToken = tokenService.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel })
  const newRefresh = tokenService.issueRefreshToken({ sub: user.id })
  return { accessToken, refreshToken: newRefresh }
}

// Routes
authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const result = await registerUser({ email, password })
    setRefreshCookie(res, result.refreshToken)
    res.status(200).json({ accessToken: result.accessToken })
  } catch (e) {
    next(e)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const result = await loginUser({ email, password })
    setRefreshCookie(res, result.refreshToken)
    res.status(200).json({ accessToken: result.accessToken })
  } catch (e) {
    next(e)
  }
})

authRouter.post('/refresh', async (req, res) => {
  const token = req.cookies?.[cookieName]
  if (!token) return res.status(401).json({ error: { message: 'No refresh token' } })
  try {
    const result = await refreshTokenUseCase(token)
    setRefreshCookie(res, result.refreshToken)
    return res.status(200).json({ accessToken: result.accessToken })
  } catch (_err) {
    clearRefreshCookie(res)
    return res.status(401).json({ error: { message: 'Invalid refresh token' } })
  }
})

authRouter.post('/logout', async (_req, res) => {
  clearRefreshCookie(res)
  res.status(200).json({ success: true })
})

