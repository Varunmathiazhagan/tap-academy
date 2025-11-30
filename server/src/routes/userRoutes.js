import express from 'express'
import { getAllUsers, getUserById } from '../controllers/userController.js'
import { authenticate, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, authorizeRoles('manager'), getAllUsers)
router.get('/:id', authenticate, getUserById)

export default router
