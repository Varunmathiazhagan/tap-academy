import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/users', userRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
