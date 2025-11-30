import Attendance from '../models/Attendance.js'
import User from '../models/User.js'
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  countWorkingDays,
  isWorkingDay,
  eachDayOfInterval,
} from '../utils/date.js'
import { attendanceSettings } from '../config/attendanceSettings.js'

export async function employeeDashboard(req, res) {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const [todayRecord, monthRecords] = await Promise.all([
    Attendance.findOne({ user: req.user.id, date: { $gte: startOfDay(today), $lte: endOfDay(today) } }).lean(),
    Attendance.find({ user: req.user.id, date: { $gte: monthStart, $lte: monthEnd } })
      .sort({ date: -1 })
      .lean(),
  ])

  const summary = monthRecords.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
      acc.totalHours = Number((acc.totalHours + (record.totalHours || 0)).toFixed(2))
      return acc
    },
    { present: 0, absent: 0, late: 0, ['half-day']: 0, totalHours: 0 }
  )

  const todayStart = startOfDay(new Date())
  const effectiveEnd = monthEnd < todayStart ? monthEnd : new Date(todayStart.getTime() - 1)

  if (effectiveEnd >= monthStart) {
    const workingDays = countWorkingDays(monthStart, effectiveEnd, attendanceSettings.workDays)
    const trackedDays = new Set(
      monthRecords
        .filter((record) => {
          const recordDay = startOfDay(record.date)
          return recordDay <= effectiveEnd && isWorkingDay(recordDay, attendanceSettings.workDays)
        })
        .map((record) => startOfDay(record.date).getTime())
    )

    const missingDays = Math.max(0, workingDays - trackedDays.size)
    summary.absent += missingDays
  }

  res.json({
    todayStatus: todayRecord?.status || 'not-checked-in',
    summary,
    recent: monthRecords.slice(0, 7),
  })
}

export async function managerDashboard(req, res) {
  const today = new Date()
  const todayRange = { $gte: startOfDay(today), $lte: endOfDay(today) }

  const weekRangeStart = startOfDay(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000))
  const weekRangeEnd = endOfDay(today)

  const [employees, todayRecords, weekRecords, departmentStats] = await Promise.all([
    User.find({ role: 'employee' }).lean(),
    Attendance.find({ date: todayRange }).populate('user', 'name employeeId department').lean(),
    Attendance.find({ date: { $gte: weekRangeStart, $lte: weekRangeEnd } })
      .select('date status user')
      .lean(),
    Attendance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.department',
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0],
            },
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0],
            },
          },
          halfDay: {
            $sum: {
              $cond: [{ $eq: ['$status', 'half-day'] }, 1, 0],
            },
          },
        },
      },
    ]),
  ])

  const presentToday = todayRecords.filter((record) => record.status === 'present' || record.status === 'late' || record.status === 'half-day').length
  const absentToday = employees.length - presentToday
  const lateToday = todayRecords.filter((record) => record.status === 'late').map((record) => record.user)
  const absentList = employees.filter((employee) => !todayRecords.some((record) => String(record.user._id) === String(employee._id)))

  const weeklyDayMap = new Map()

  weekRecords.forEach((record) => {
    const day = startOfDay(record.date)
    const key = day.getTime()
    if (!weeklyDayMap.has(key)) {
      weeklyDayMap.set(key, {
        date: day,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        attendees: new Set(),
      })
    }

    const summary = weeklyDayMap.get(key)
    summary.attendees.add(String(record.user))

    if (record.status === 'present') summary.present += 1
    if (record.status === 'late') summary.late += 1
    if (record.status === 'half-day') summary.halfDay += 1
    if (record.status === 'absent') summary.absent += 1
  })

  const weeklyTrend = eachDayOfInterval(weekRangeStart, today).map((day) => {
    const key = startOfDay(day).getTime()
    const summary = weeklyDayMap.get(key)
    const trendEntry = {
      date: day.toISOString().slice(0, 10),
      present: summary?.present || 0,
      late: summary?.late || 0,
      halfDay: summary?.halfDay || 0,
      absent: summary?.absent || 0,
    }

    if (isWorkingDay(day, attendanceSettings.workDays)) {
      const attendees = summary?.attendees.size || 0
      const inferredAbsences = Math.max(0, employees.length - attendees)
      trendEntry.absent += inferredAbsences
    }

    return trendEntry
  })

  res.json({
    totalEmployees: employees.length,
    today: {
      present: presentToday,
      absent: absentToday,
      late: lateToday,
    },
    weeklyTrend,
    departmentStats: departmentStats.map((item) => ({
      department: item._id,
      present: item.present,
      absent: item.absent,
      late: item.late,
      halfDay: item.halfDay,
    })),
    absentEmployees: absentList.map((employee) => ({
      id: employee._id,
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
    })),
  })
}
