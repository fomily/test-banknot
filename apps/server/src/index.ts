import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors({ origin: true, credentials: true }))

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Swagger placeholder
app.get('/docs', (_req, res) => {
  res.status(200).send('<html><body><h1>API Docs</h1><p>Swagger will be here.</p></body></html>')
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`)
})
