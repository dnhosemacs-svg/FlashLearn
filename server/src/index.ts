import express from 'express'
import cors from 'cors'

const app = express()
const PORT = Number(process.env.PORT) || 4000

app.use(cors())
app.use(express.json())

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'flashlearn-api',
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})