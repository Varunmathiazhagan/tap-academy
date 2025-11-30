import { validationResult } from 'express-validator'
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWorkingDay,
  countWorkingDays,
} from '../utils/date.js'
import Attendance from '../models/Attendance.js'
import User from '../models/User.js'
import { buildAttendanceCsv } from '../utils/csvExporter.js'
import { attendanceSettings } from '../config/attendanceSettings.js'

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw new Error(errors.array().map((error) => error.msg).join(', '))
  }
}

function determineStatus(checkInDate, checkOutDate) {
  const { officeStartHour, lateThresholdMinutes } = attendanceSettings
  if (!checkInDate) {
    return 'absent'
  }

  const totalMinutes = checkInDate.getHours() * 60 + checkInDate.getMinutes()
  const lateThreshold = officeStartHour * 60 + lateThresholdMinutes
  if (totalMinutes > lateThreshold) {
    return 'late'
  }

  if (checkOutDate) {
    const totalHours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)
    if (totalHours < 4) {
      return 'half-day'
    }
  }

  return 'present'
}

function createVirtualAbsenceRecords(records, rangeStart, rangeEnd, userId) {
  const todayStart = startOfDay(new Date())
  const effectiveEnd = rangeEnd < todayStart ? rangeEnd : new Date(todayStart.getTime() - 1)

  if (effectiveEnd < rangeStart) {
    return []
  }

  const recordMap = new Map(
    records.map((record) => [startOfDay(record.date).getTime(), record])
  )

  const virtualRecords = []

  eachDayOfInterval(rangeStart, effectiveEnd).forEach((day) => {
    if (!isWorkingDay(day, attendanceSettings.workDays)) return

    const key = day.getTime()
    if (recordMap.has(key)) return

    virtualRecords.push({
      _id: `virtual-${key}`,
      user: userId,
      date: day,
      status: 'absent',
      checkInTime: null,
      checkOutTime: null,
      totalHours: 0,
      isVirtual: true,
    })
  })

  return virtualRecords
}

function enhanceSummaryWithAbsences(summary, records, rangeStart, rangeEnd) {
  const todayStart = startOfDay(new Date())
  const effectiveEnd = rangeEnd < todayStart ? rangeEnd : new Date(todayStart.getTime() - 1)

  if (effectiveEnd < rangeStart) {
    return summary
  }

  const trackedDays = new Set(
    records
      .filter((record) => {
        const recordDay = startOfDay(record.date)
        return recordDay <= effectiveEnd && isWorkingDay(recordDay, attendanceSettings.workDays)
      })
      .map((record) => startOfDay(record.date).getTime())
  )

  const workingDays = countWorkingDays(rangeStart, effectiveEnd, attendanceSettings.workDays)
  const unresolvedAbsences = Math.max(0, workingDays - trackedDays.size)

  summary.absent = (summary.absent || 0) + unresolvedAbsences
  return summary
}

export async function checkIn(req, res) {
  handleValidation(req, res)
  const now = new Date()
  const dayStart = startOfDay(now)
  const existing = await Attendance.findOne({
    user: req.user.id,
    date: {
      $gte: dayStart,
      $lte: endOfDay(now),
    },
  })

  if (existing && existing.checkInTime) {
    res.status(400)
    throw new Error('Already checked in today')
  }

  const attendance = existing || new Attendance({
    user: req.user.id,
    date: dayStart,
  })

  attendance.date = dayStart
  attendance.checkInTime = now
  attendance.status = determineStatus(now)

  try {
    await attendance.save()
  } catch (error) {
    if (error?.code === 11000) {
      res.status(400)
      throw new Error('Already checked in today')
    }
    throw error
  }

  res.status(existing ? 200 : 201).json({ attendance })
}

export async function checkOut(req, res) {
  handleValidation(req, res)
  const now = new Date()
  const attendance = await Attendance.findOne({
    user: req.user.id,
    date: {
      $gte: startOfDay(now),
      $lte: endOfDay(now),
    },
  })

  if (!attendance || !attendance.checkInTime) {
    res.status(400)
    throw new Error('Check-in required before check-out')
  }

  if (attendance.checkOutTime) {
    res.status(400)
    throw new Error('Already checked out today')
  }

  attendance.checkOutTime = now
  const totalHours = (attendance.checkOutTime.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60)
  attendance.totalHours = Math.max(0, Number(totalHours.toFixed(2)))
  attendance.status = determineStatus(attendance.checkInTime, attendance.checkOutTime)

  await attendance.save()

  res.json({ attendance })
}

export async function myHistory(req, res) {
  const month = req.query.month ? new Date(req.query.month) : new Date()
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const rawRecords = await Attendance.find({
    user: req.user.id,
    date: { $gte: monthStart, $lte: monthEnd },
  })
    .sort({ date: -1 })
    .lean()

  const virtualRecords = createVirtualAbsenceRecords(rawRecords, monthStart, monthEnd, req.user.id)
  const records = [...rawRecords, ...virtualRecords].sort((a, b) => new Date(b.date) - new Date(a.date))

  res.json({ records })
}

export async function mySummary(req, res) {
  const now = req.query.month ? new Date(req.query.month) : new Date()
  const rangeStart = startOfMonth(now)
  const rangeEnd = endOfMonth(now)
  const records = await Attendance.find({
    user: req.user.id,
    date: { $gte: rangeStart, $lte: rangeEnd },
  }).lean()

  const summary = records.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
      acc.totalHours = Number((acc.totalHours + (record.totalHours || 0)).toFixed(2))
      return acc
    },
    { present: 0, absent: 0, late: 0, ['half-day']: 0, totalHours: 0 }
  )

  enhanceSummaryWithAbsences(summary, records, rangeStart, rangeEnd)

  res.json({ summary })
}

export async function todayStatus(req, res) {
  const now = new Date()
  const attendance = await Attendance.findOne({
    user: req.user.id,
    date: { $gte: startOfDay(now), $lte: endOfDay(now) },
  }).lean()

  res.json({ attendance })
}

export async function getAllAttendance(req, res) {
  const { employeeId, status, startDate, endDate } = req.query
  const query = {}

  if (employeeId) {
    const user = await User.findOne({ employeeId }).select('_id')
    if (user) {
      query.user = user._id
    } else {
      return res.json({ records: [] })
    }
  }

  if (status) {
    query.status = status
  }

  if (startDate || endDate) {
    query.date = {}
    if (startDate) {
      query.date.$gte = startOfDay(new Date(startDate))
    }
    if (endDate) {
      query.date.$lte = endOfDay(new Date(endDate))
    }
  }

  const records = await Attendance.find(query)
    .populate('user', 'name email employeeId department role')
    .sort({ date: -1 })
    .lean()

  res.json({ records })
}

export async function getEmployeeAttendance(req, res) {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
    res.status(404)
    throw new Error('Employee not found')
  }

  const records = await Attendance.find({ user: user._id })
    .sort({ date: -1 })
    .lean()

  res.json({
    employee: {
      id: user._id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      department: user.department,
    },
    records,
  })
}

export async function teamSummary(req, res) {
  const { department } = req.query
  const match = department ? { department } : {}
  const teamMembers = await User.find({ role: 'employee', ...match })
    .select('_id department')
    .lean()

  const memberIds = teamMembers.map((member) => member._id)
  const now = req.query.month ? new Date(req.query.month) : new Date()
  const rangeStart = startOfMonth(now)
  const rangeEnd = endOfMonth(now)

  if (memberIds.length === 0) {
    return res.json({ summary: { present: 0, absent: 0, late: 0, ['half-day']: 0 }, totalMembers: 0 })
  }

  const monthRecords = await Attendance.find({
    user: { $in: memberIds },
    date: { $gte: rangeStart, $lte: rangeEnd },
  })
    .select('user date status')
    .lean()

  const summary = monthRecords.reduce(
    (acc, record) => {
      if (acc[record.status] !== undefined) {
        acc[record.status] += 1
      }
      return acc
    },
    { present: 0, absent: 0, late: 0, ['half-day']: 0 }
  )

  const todayStart = startOfDay(new Date())
  const effectiveEnd = rangeEnd < todayStart ? rangeEnd : new Date(todayStart.getTime() - 1)

  if (effectiveEnd >= rangeStart) {
    const workingDays = countWorkingDays(rangeStart, effectiveEnd, attendanceSettings.workDays)
    const expectedEntries = workingDays * teamMembers.length

    const uniqueAttendance = new Set(
      monthRecords
        .filter((record) => startOfDay(record.date) <= effectiveEnd && isWorkingDay(record.date, attendanceSettings.workDays))
        .map((record) => `${record.user.toString()}-${startOfDay(record.date).getTime()}`)
    )

    const missingEntries = Math.max(0, expectedEntries - uniqueAttendance.size)
    summary.absent += missingEntries
  }

  res.json({ summary, totalMembers: teamMembers.length })
}

export async function exportCsv(req, res) {
  const { startDate, endDate, employeeId } = req.query
  const filters = {}

  if (startDate || endDate) {
    filters.date = {}
    if (startDate) {
      filters.date.$gte = startOfDay(new Date(startDate))
    }
    if (endDate) {
      filters.date.$lte = endOfDay(new Date(endDate))
    }
  }

  if (employeeId) {
    const user = await User.findOne({ employeeId }).select('_id')
    if (user) {
      filters.user = user._id
    }
  }

  const records = await Attendance.find(filters)
    .populate('user', 'name email employeeId department')
    .sort({ date: -1 })
    .lean()

  const csv = buildAttendanceCsv(records)
  res.header('Content-Type', 'text/csv')
  res.attachment('attendance.csv')
  res.send(csv)
}

export async function todayTeamStatus(req, res) {
  const today = new Date()
  const records = await Attendance.find({
    date: { $gte: startOfDay(today), $lte: endOfDay(today) },
  })
    .populate('user', 'name email employeeId department')
    .lean()

  res.json({ records })
}
