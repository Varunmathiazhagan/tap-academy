import Attendance from '../models/Attendance.js'
import User from '../models/User.js'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from '../utils/date.js'

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

  res.json({
    todayStatus: todayRecord?.status || 'not-checked-in',
    summary,
    recent: monthRecords.slice(0, 7),
  })
}

export async function managerDashboard(req, res) {
  const today = new Date()
  const todayRange = { $gte: startOfDay(today), $lte: endOfDay(today) }

  const [employees, todayRecords, weekRecords, departmentStats] = await Promise.all([
    User.find({ role: 'employee' }).lean(),
    Attendance.find({ date: todayRange }).populate('user', 'name employeeId department').lean(),
    Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: startOfDay(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
            $lte: endOfDay(today),
          },
        },
      },
      {
        $group: {
          _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, status: '$status' },
          count: { $sum: 1 },
        },
      },
    ]),
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

  const weeklyTrend = weekRecords.reduce((acc, item) => {
    if (!acc[item._id.day]) {
      acc[item._id.day] = { date: item._id.day, present: 0, absent: 0, late: 0, halfDay: 0 }
    }
    if (item._id.status === 'present') acc[item._id.day].present += item.count
    if (item._id.status === 'absent') acc[item._id.day].absent += item.count
    if (item._id.status === 'late') acc[item._id.day].late += item.count
    if (item._id.status === 'half-day') acc[item._id.day].halfDay += item.count
    return acc
  }, {})

  res.json({
    totalEmployees: employees.length,
    today: {
      present: presentToday,
      absent: absentToday,
      late: lateToday,
    },
    weeklyTrend: Object.values(weeklyTrend).sort((a, b) => (a.date > b.date ? 1 : -1)),
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
