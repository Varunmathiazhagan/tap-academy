import express from 'express'
import { body } from 'express-validator'
import {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  todayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  teamSummary,
  exportCsv,
  todayTeamStatus,
} from '../controllers/attendanceController.js'
import { authenticate, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()

router.post(
  '/checkin',
  authenticate,
  authorizeRoles('employee'),
  [body('location').optional().isString()],
  checkIn
)

router.post('/checkout', authenticate, authorizeRoles('employee'), checkOut)

router.get('/my-history', authenticate, authorizeRoles('employee'), myHistory)
router.get('/my-summary', authenticate, authorizeRoles('employee'), mySummary)
router.get('/today', authenticate, authorizeRoles('employee'), todayStatus)

router.get('/all', authenticate, authorizeRoles('manager'), getAllAttendance)
router.get('/employee/:id', authenticate, authorizeRoles('manager'), getEmployeeAttendance)
router.get('/summary', authenticate, authorizeRoles('manager'), teamSummary)
router.get('/export', authenticate, authorizeRoles('manager'), exportCsv)
router.get('/today-status', authenticate, authorizeRoles('manager'), todayTeamStatus)

export default router
