import express from 'express'
import { employeeDashboard, managerDashboard } from '../controllers/dashboardController.js'
import { authenticate, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.get('/employee', authenticate, authorizeRoles('employee'), employeeDashboard)
router.get('/manager', authenticate, authorizeRoles('manager'), managerDashboard)

export default router
