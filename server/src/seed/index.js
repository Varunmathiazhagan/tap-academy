import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDatabase } from '../config/database.js'
import User from '../models/User.js'
import Attendance from '../models/Attendance.js'
import { users as seedUsers } from './data.js'
import { startOfDay } from '../utils/date.js'

dotenv.config()

async function seed() {
  try {
    await connectDatabase(process.env.MONGO_URI)

    await Attendance.deleteMany({})
    await User.deleteMany({})

    const users = await Promise.all(
      seedUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        return User.create({ ...user, password: hashedPassword })
      })
    )

    const attendanceDocs = []
    const now = new Date()
    const OFFICE_START_HOUR = Number(process.env.OFFICE_START_HOUR || 9)
    const LATE_THRESHOLD_MINUTES = Number(process.env.LATE_THRESHOLD_MINUTES || 15)
    const TOTAL_CALENDAR_DAYS = 60 // seed roughly two months of workdays

    const workdayDates = []
    for (let i = 0; i < TOTAL_CALENDAR_DAYS; i += 1) {
      const date = new Date(startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000)))
      if (date.getDay() === 0 || date.getDay() === 6) continue
      workdayDates.push(date)
    }

    const defaultOffsets = {
      present: [-20, 5],
      late: [LATE_THRESHOLD_MINUTES + 10, LATE_THRESHOLD_MINUTES + 60],
      'half-day': [-10, 20],
    }

    const defaultHours = {
      present: [7.5, 9],
      late: [6.5, 8],
      'half-day': [3, 4],
    }

    const departmentShiftStarts = {
      'Field Operations': 8,
      Facilities: 7,
      Security: 7,
      'Remote Programs': 10,
      'Learning & Development': 10,
      'Technical Support': 8,
      'Customer Success': 8,
      Analytics: 10,
      'Quality Assurance': 9,
    }

    const employeeOverrides = {
      EMP201: [
        {
          offsetFromToday: 0,
          status: 'present',
          checkInOffsetMinutes: -35,
          totalHours: 8.5,
        },
        {
          offsetFromToday: 2,
          status: 'late',
          checkInOffsetMinutes: LATE_THRESHOLD_MINUTES + 60,
          totalHours: 7.1,
        },
        { offsetFromToday: 5, status: 'absent' },
      ],
      EMP202: [
        {
          offsetFromToday: 1,
          status: 'present',
          checkInOffsetMinutes: -50,
          totalHours: 9.2,
        },
        {
          offsetFromToday: 4,
          status: 'half-day',
          checkInOffsetMinutes: -15,
          totalHours: 3.8,
        },
      ],
      EMP203: [
        {
          offsetFromToday: 3,
          status: 'present',
          checkInOffsetMinutes: -40,
          totalHours: 7.5,
          missingCheckout: true,
        },
        {
          offsetFromToday: 10,
          status: 'late',
          checkInOffsetMinutes: LATE_THRESHOLD_MINUTES + 35,
          totalHours: 6.9,
        },
      ],
      EMP204: [
        { offsetFromToday: 6, status: 'holiday' },
        {
          offsetFromToday: 11,
          status: 'present',
          checkInOffsetMinutes: -30,
          totalHours: 8.9,
          ignoreCompanyHoliday: true,
        },
      ],
      EMP205: [
        { offsetFromToday: 0, status: 'absent' },
        {
          offsetFromToday: 9,
          status: 'half-day',
          checkInOffsetMinutes: 10,
          totalHours: 3.4,
        },
      ],
      EMP206: [
        {
          offsetFromToday: 2,
          status: 'present',
          checkInOffsetMinutes: -20,
          totalHours: 8,
        },
        {
          offsetFromToday: 7,
          status: 'late',
          checkInOffsetMinutes: LATE_THRESHOLD_MINUTES + 90,
          totalHours: 7.4,
        },
      ],
      EMP301: [
        {
          offsetFromToday: 0,
          status: 'late',
          checkInOffsetMinutes: LATE_THRESHOLD_MINUTES + 20,
          totalHours: 7.8,
        },
        { offsetFromToday: 8, status: 'absent' },
      ],
      EMP302: [
        {
          offsetFromToday: 5,
          status: 'half-day',
          checkInOffsetMinutes: -5,
          totalHours: 3.5,
        },
        {
          offsetFromToday: 12,
          status: 'present',
          checkInOffsetMinutes: -25,
          totalHours: 6.1,
          missingCheckout: true,
        },
      ],
      EMP303: [
        {
          offsetFromToday: 4,
          status: 'present',
          checkInOffsetMinutes: -45,
          totalHours: 9.6,
        },
        {
          offsetFromToday: 13,
          status: 'late',
          checkInOffsetMinutes: LATE_THRESHOLD_MINUTES + 55,
          totalHours: 6.8,
        },
      ],
      EMP304: [
        { offsetFromToday: 1, status: 'holiday' },
        {
          offsetFromToday: 3,
          status: 'present',
          checkInOffsetMinutes: -60,
          totalHours: 9.4,
          ignoreCompanyHoliday: true,
        },
        { offsetFromToday: 14, status: 'absent' },
      ],
      EMP305: [
        {
          offsetFromToday: 2,
          status: 'half-day',
          checkInOffsetMinutes: 20,
          totalHours: 3.2,
        },
        {
          offsetFromToday: 7,
          status: 'present',
          checkInOffsetMinutes: -55,
          totalHours: 8.7,
        },
      ],
      EMP306: [
        {
          offsetFromToday: 0,
          status: 'present',
          checkInOffsetMinutes: -25,
          totalHours: 8.2,
        },
        {
          offsetFromToday: 6,
          status: 'late',
          checkInOffsetMinutes: LATE_THRESHOLD_MINUTES + 40,
          totalHours: 7,
        },
      ],
    }

    const patternConfigs = [
      {
        name: 'highPerformer',
        cycle: ['present', 'present', 'present', 'present', 'present', 'late', 'present', 'absent'],
        hours: { present: [8.2, 9.2] },
      },
      {
        name: 'growthMindset',
        cycle: ['present', 'late', 'present', 'present', 'half-day', 'present', 'present', 'absent'],
        offsets: { late: [LATE_THRESHOLD_MINUTES + 25, LATE_THRESHOLD_MINUTES + 70] },
      },
      {
        name: 'supportFlex',
        cycle: ['present', 'present', 'half-day', 'present', 'late', 'present', 'absent', 'present'],
        hours: { 'half-day': [3.2, 3.8] },
      },
      {
        name: 'fieldOps',
        cycle: ['late', 'present', 'present', 'half-day', 'present', 'present', 'absent', 'present'],
        offsets: { present: [-15, 15] },
      },
      {
        name: 'alternatingShift',
        cycle: ['half-day', 'present', 'present', 'late', 'present', 'absent', 'present', 'present'],
        offsets: { 'half-day': [0, 30] },
      },
    ]

    const randomInRange = (min, max) => min + Math.random() * (max - min)
    const randomIntRange = (min, max) => Math.round(randomInRange(min, max))

    const overridesByEmployeeId = new Map()
    Object.entries(employeeOverrides).forEach(([employeeId, overrides]) => {
      overrides.forEach((overrideConfig) => {
        if (overrideConfig.offsetFromToday < 0) return
        const targetDate = workdayDates[overrideConfig.offsetFromToday]
        if (!targetDate) return
        const key = targetDate.toISOString()
        if (!overridesByEmployeeId.has(employeeId)) {
          overridesByEmployeeId.set(employeeId, new Map())
        }
        overridesByEmployeeId.get(employeeId).set(key, { ...overrideConfig, date: targetDate })
      })
    })

    const companyHolidayIndices = [4, 13, 18].filter((index) => workdayDates[index])
    const companyWideHolidays = new Set(
      companyHolidayIndices.map((index) => workdayDates[index].toISOString()),
    )

    users
      .filter((user) => user.role === 'employee')
      .forEach((user, userIndex) => {
        const pattern = patternConfigs[userIndex % patternConfigs.length]
        const overridesForEmployee = overridesByEmployeeId.get(user.employeeId)

        workdayDates.forEach((date, workdayIndex) => {
          const cycleIndex = (workdayIndex + userIndex) % pattern.cycle.length
          const status = pattern.cycle[cycleIndex]
          const dateKey = date.toISOString()
          const override = overridesForEmployee?.get(dateKey)

          if (companyWideHolidays.has(dateKey) && !override?.ignoreCompanyHoliday) {
            attendanceDocs.push({
              user: user._id,
              date,
              checkInTime: null,
              checkOutTime: null,
              status: 'holiday',
              totalHours: 0,
            })
            return
          }

          if (override) {
            const overrideStatus = override.status
            if (overrideStatus === 'absent' || overrideStatus === 'holiday') {
              attendanceDocs.push({
                user: user._id,
                date,
                checkInTime: null,
                checkOutTime: null,
                status: overrideStatus,
                totalHours: 0,
              })
              return
            }

            const offsetRange = pattern.offsets?.[overrideStatus] ?? defaultOffsets[overrideStatus]
            const hoursRange = pattern.hours?.[overrideStatus] ?? defaultHours[overrideStatus]
            const offsetMinutes =
              override.checkInOffsetMinutes ??
              randomIntRange(offsetRange[0], offsetRange[1])
            const shiftStartHour = departmentShiftStarts[user.department] ?? OFFICE_START_HOUR
            const checkInTime = new Date(
              date.getTime() + (shiftStartHour * 60 + offsetMinutes) * 60 * 1000,
            )
            const baseHours =
              override.totalHours ?? randomInRange(hoursRange[0], hoursRange[1])
            const workHours = Math.round(baseHours * 100) / 100
            const checkOutTime = override.missingCheckout
              ? null
              : new Date(checkInTime.getTime() + workHours * 60 * 60 * 1000)

            attendanceDocs.push({
              user: user._id,
              date,
              checkInTime,
              checkOutTime,
              status: overrideStatus,
              totalHours: override.missingCheckout ? 0 : workHours,
            })
            return
          }

          if (status === 'absent') {
            attendanceDocs.push({
              user: user._id,
              date,
              checkInTime: null,
              checkOutTime: null,
              status,
              totalHours: 0,
            })
            return
          }

          const offsetRange = pattern.offsets?.[status] ?? defaultOffsets[status]
          const offsetMinutes = randomIntRange(offsetRange[0], offsetRange[1])
          const shiftStartHour = departmentShiftStarts[user.department] ?? OFFICE_START_HOUR
          const checkInTime = new Date(
            date.getTime() + (shiftStartHour * 60 + offsetMinutes) * 60 * 1000,
          )

          const hoursRange = pattern.hours?.[status] ?? defaultHours[status]
          const baseHours = randomInRange(hoursRange[0], hoursRange[1])
          const workHours = Math.round(baseHours * 100) / 100
          const checkOutTime = new Date(checkInTime.getTime() + workHours * 60 * 60 * 1000)

          attendanceDocs.push({
            user: user._id,
            date,
            checkInTime,
            checkOutTime,
            status,
            totalHours: workHours,
          })
        })
      })

    await Attendance.insertMany(attendanceDocs)

    const statusSummary = attendanceDocs.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
      return acc
    }, {})

    console.log(`Seeded ${users.length} users`)
    console.log(`Seeded ${attendanceDocs.length} attendance records`)
    console.log('Attendance status distribution:', statusSummary)
    process.exit(0)
  } catch (error) {
    console.error('Seed failed', error)
    process.exit(1)
  }
}

seed()
