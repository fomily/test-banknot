import { createApp } from './app'
import { loadEnv } from '@packages/config'

const app = createApp()

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found', path: req.path } })
})

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: import('express').Request, res: import('express').Response, _next: import('express').NextFunction) => {
  const env = loadEnv()
  const isProd = env.NODE_ENV === 'production'
  const message = err instanceof Error ? err.message : 'Internal Server Error'
  const status = 500
  res.status(status).json({
    error: {
      message,
      ...(isProd ? {} : { details: String(err) }),
    },
  })
})

const env = loadEnv()
const port = env.PORT
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`)
})
