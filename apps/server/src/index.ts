import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

const app = express()

// Trust reverse proxy (needed for Secure cookies behind proxy)
app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// CORS whitelist from env (comma-separated origins)
const corsOriginsEnv = process.env.CORS_ORIGINS || ''
const allowedOrigins = corsOriginsEnv
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

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
