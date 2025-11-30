import http from 'http'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app.js'
import { connectDatabase } from './config/database.js'

dotenv.config()

const port = Number(process.env.PORT) || 5000

const server = http.createServer(app)

async function startServer() {
  try {
    await connectDatabase(process.env.MONGO_URI)
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  server.close(() => {
    console.log('Server closed due to SIGINT')
    process.exit(0)
  })
})

process.on('SIGTERM', async () => {
  await mongoose.connection.close()
  server.close(() => {
    console.log('Server closed due to SIGTERM')
    process.exit(0)
  })
})

startServer()
