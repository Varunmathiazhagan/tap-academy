import express from 'express'
import { body } from 'express-validator'
import { register, login, me, logout } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('department').notEmpty().withMessage('Department is required'),
]

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)

export default router
