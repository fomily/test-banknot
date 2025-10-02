import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { buildCorsOptions, loadEnv } from '@packages/config'
import { authRouter } from './auth'
import { usersRouter } from './users'

export const createApp = () => {
  const env = loadEnv()
  const app = express()

  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())

  const corsOptions = buildCorsOptions()
  if (corsOptions) app.use(cors(corsOptions))

  if (env.NODE_ENV === 'production') {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
    app.use(limiter)
  }

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

  app.get('/docs', (_req, res) => {
    res.status(200).send('<html><body><h1>API Docs</h1><p>Swagger will be here.</p></body></html>')
  })

  app.use('/auth', authRouter)
  app.use('/users', usersRouter)

  // 404 and error handlers are expected to be registered by caller after routes

  return app
}

