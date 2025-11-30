import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday } from 'date-fns'
import clsx from 'clsx'
import StatusBadge from '../common/StatusBadge'

/**
 * Manager Bird's Eye Calendar
 * Shows all employees in a calendar grid with:
 * - Hover tooltips for details
 * - Filter by department
 * - Badge indicators on each date
 */
export default function TeamBirdsEyeCalendar({ teamRecords = [], employees = [], monthDate = new Date() }) {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedDate, setSelectedDate] = useState(null)

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(employees.map((emp) => emp.department))
    return ['all', ...Array.from(depts)]
  }, [employees])

  // Filter employees by department
  const filteredEmployees = useMemo(() => {
    if (selectedDepartment === 'all') return employees
    return employees.filter((emp) => emp.department === selectedDepartment)
  }, [employees, selectedDepartment])

  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get records for a specific employee and date
  const getRecordsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return teamRecords.filter((record) => record.date.startsWith(dateStr))
  }

  // Get stats for a specific date
  const getDateStats = (date) => {
    const records = getRecordsForDate(date)
    return {
      present: records.filter((r) => r.status === 'present').length,
      late: records.filter((r) => r.status === 'late').length,
      absent: filteredEmployees.length - records.length,
      halfDay: records.filter((r) => r.status === 'half-day').length,
    }
  }

  // Get color for date cell based on attendance
  const getDateColor = (stats, totalEmployees) => {
    if (totalEmployees === 0) return 'bg-slate-900/30'
    const attendanceRate = ((stats.present + stats.late + stats.halfDay) / totalEmployees) * 100
    
    if (attendanceRate >= 90) return 'bg-emerald-500/20 border-emerald-500/40'
    if (attendanceRate >= 70) return 'bg-yellow-500/20 border-yellow-500/40'
    if (attendanceRate >= 50) return 'bg-orange-500/20 border-orange-500/40'
    return 'bg-rose-500/20 border-rose-500/40'
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/60 to-slate-900/40 p-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold text-white">Team Calendar Overview</h3>
          <p className="mt-1 text-sm text-slate-400">
            {format(monthDate, 'MMMM yyyy')} • {filteredEmployees.length} employees
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-400">Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 shadow-xl">
        {/* Day headers */}
        <div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const stats = getDateStats(day)
            const isCurrentMonth = isSameMonth(day, monthStart)
            const dayRecords = getRecordsForDate(day)

            return (
              <button
                type="button"
                key={day.toISOString()}
                onClick={() => setSelectedDate({ date: day, records: dayRecords, stats })}
                className={clsx(
                  'group relative min-h-24 rounded-xl border p-3 text-left transition-all hover:scale-105 hover:shadow-xl',
                  getDateColor(stats, filteredEmployees.length),
                  !isCurrentMonth && 'opacity-40',
                  isToday(day) && 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950'
                )}
              >
                <div className="mb-2 text-lg font-bold text-white">{format(day, 'd')}</div>

                {/* Badge indicators */}
                <div className="space-y-1 text-[10px]">
                  {stats.present > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-300">{stats.present} present</span>
                    </div>
                  )}
                  {stats.late > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-yellow-300">{stats.late} late</span>
                    </div>
                  )}
                  {stats.absent > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-rose-300">{stats.absent} absent</span>
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-48 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-2xl group-hover:block">
                  <div className="text-xs">
                    <div className="font-semibold text-white">{format(day, 'MMM d, yyyy')}</div>
                    <div className="mt-2 space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span>Present:</span>
                        <span className="font-medium text-emerald-400">{stats.present}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Late:</span>
                        <span className="font-medium text-yellow-400">{stats.late}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Absent:</span>
                        <span className="font-medium text-rose-400">{stats.absent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Half Day:</span>
                        <span className="font-medium text-orange-400">{stats.halfDay}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {format(selectedDate.date, 'EEEE, MMMM d, yyyy')}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {selectedDate.records.length} / {filteredEmployees.length} employees checked in
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stats Summary */}
            <div className="mb-6 grid grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                <p className="text-xs uppercase text-emerald-400">Present</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">{selectedDate.stats.present}</p>
              </div>
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center">
                <p className="text-xs uppercase text-yellow-400">Late</p>
                <p className="mt-1 text-2xl font-bold text-yellow-300">{selectedDate.stats.late}</p>
              </div>
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-center">
                <p className="text-xs uppercase text-orange-400">Half Day</p>
                <p className="mt-1 text-2xl font-bold text-orange-300">{selectedDate.stats.halfDay}</p>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center">
                <p className="text-xs uppercase text-rose-400">Absent</p>
                <p className="mt-1 text-2xl font-bold text-rose-300">{selectedDate.stats.absent}</p>
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Employee Details</h4>
              <div className="space-y-2">
                {filteredEmployees.map((employee) => {
                  const record = selectedDate.records.find((r) => r.user._id === employee._id)
                  return (
                    <div
                      key={employee._id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-white">{employee.name}</p>
                        <p className="text-xs text-slate-400">
                          {employee.employeeId} • {employee.department}
                        </p>
                      </div>
                      <div className="text-right">
                        {record ? (
                          <>
                            <StatusBadge status={record.status} />
                            <p className="mt-1 text-xs text-slate-400">
                              {record.checkInTime
                                ? format(new Date(record.checkInTime), 'h:mm a')
                                : '—'}
                            </p>
                          </>
                        ) : (
                          <StatusBadge status="absent" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
