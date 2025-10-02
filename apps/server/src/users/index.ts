import { Router } from 'express'
import { getPrisma } from '../prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'

export const usersRouter = Router()
const prisma = getPrisma()

// Use-case: Get current user profile
async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      middleName: true,
      avatarUrl: true,
      ratingLevel: true,
      isAdmin: true,
      createdAt: true,
      wallet: {
        select: {
          balance: true,
        },
      },
    },
  })
  if (!user) throw new Error('User not found')
  return user
}

// Use-case: Update passport data (firstName, lastName, middleName)
async function updatePassportData(params: {
  userId: string
  firstName: string
  lastName: string
  middleName?: string
}) {
  // Validation
  if (!params.firstName || params.firstName.length < 2) {
    throw new Error('firstName must be at least 2 characters')
  }
  if (!params.lastName || params.lastName.length < 2) {
    throw new Error('lastName must be at least 2 characters')
  }
  if (params.middleName !== undefined && params.middleName !== null && params.middleName.length > 0 && params.middleName.length < 2) {
    throw new Error('middleName must be at least 2 characters or empty')
  }

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: {
      firstName: params.firstName,
      lastName: params.lastName,
      middleName: params.middleName || null,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      middleName: true,
      ratingLevel: true,
      isAdmin: true,
    },
  })
  return user
}

// Routes
usersRouter.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await getMe(req.userId!)
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
})

usersRouter.patch('/me/profile', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { firstName, lastName, middleName } = req.body as {
      firstName: string
      lastName: string
      middleName?: string
    }
    const user = await updatePassportData({
      userId: req.userId!,
      firstName,
      lastName,
      middleName,
    })
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
})

