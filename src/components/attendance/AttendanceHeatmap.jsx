import { endOfMonth, eachDayOfInterval, format, isToday } from 'date-fns'
import clsx from 'clsx'

/**
 * Calendar Heatmap Component - GitHub-style contribution graph
 * Shows attendance with color-coded cells:
 * Green = Present, Yellow = Late, Orange = Half Day, Red = Absent
 */
export default function AttendanceHeatmap({ records = [], year = new Date().getFullYear(), onDayClick }) {
  // Generate all months for the year
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1))

  const getStatusForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = records.find((r) => r.date.startsWith(dateStr))
    return record?.status
  }

  const getIntensityClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500 border-emerald-400 shadow-emerald-500/30'
      case 'late':
        return 'bg-yellow-500 border-yellow-400 shadow-yellow-500/30'
      case 'half-day':
        return 'bg-orange-500 border-orange-400 shadow-orange-500/30'
      case 'absent':
        return 'bg-rose-500 border-rose-400 shadow-rose-500/30'
      default:
        return 'bg-slate-800/50 border-slate-700'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/30 to-transparent p-4 sm:p-5 md:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Attendance Heatmap</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">Your attendance activity for {year}</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Less</span>
          <div className="flex gap-1">
            <div className="h-4 w-4 rounded border border-slate-700 bg-slate-800/50" />
            <div className="h-4 w-4 rounded border border-emerald-400 bg-emerald-500" />
            <div className="h-4 w-4 rounded border border-yellow-400 bg-yellow-500" />
            <div className="h-4 w-4 rounded border border-orange-400 bg-orange-500" />
            <div className="h-4 w-4 rounded border border-rose-400 bg-rose-500" />
          </div>
          <span className="text-slate-400">More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {months.map((monthStart) => {
          const monthEnd = endOfMonth(monthStart)
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
          
          // Organize days into weeks
          const weeks = []
          let currentWeek = []
          
          days.forEach((day, index) => {
            const dayOfWeek = day.getDay() // 0 = Sunday
            
            // Start new week on Monday (1)
            if (dayOfWeek === 1 && currentWeek.length > 0) {
              weeks.push(currentWeek)
              currentWeek = []
            }
            
            currentWeek.push(day)
            
            // Last day
            if (index === days.length - 1) {
              weeks.push(currentWeek)
            }
          })

          return (
            <div key={monthStart.toISOString()} className="rounded-xl border border-slate-700/30 bg-transparent p-3 sm:p-4">
              <h4 className="mb-3 text-sm font-bold text-white">{format(monthStart, 'MMMM')}</h4>
              
              <div className="space-y-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex gap-1">
                    {week.map((day) => {
                      const status = getStatusForDate(day)
                      const record = records.find((r) => r.date.startsWith(format(day, 'yyyy-MM-dd')))
                      
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          onClick={() => onDayClick && record && onDayClick(day, record)}
                          className={clsx(
                            'group relative h-3 w-3 rounded-sm border transition-all hover:scale-150 hover:shadow-lg',
                            getIntensityClass(status),
                            isToday(day) && 'ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900',
                            record && 'cursor-pointer'
                          )}
                          title={`${format(day, 'MMM d')}: ${status || 'No data'}`}
                        >
                          {/* Tooltip on hover */}
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white shadow-xl group-hover:block">
                            <div className="font-semibold">{format(day, 'MMM d, yyyy')}</div>
                            {record && (
                              <div className="mt-1 text-slate-300">
                                {status && <div className="capitalize">{status.replace('-', ' ')}</div>}
                                {record.totalHours && <div>{record.totalHours.toFixed(1)} hours</div>}
                              </div>
                            )}
                            {!record && <div className="text-slate-400">No attendance</div>}
                            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 border-t border-slate-700/30 pt-4 sm:pt-6">
        <div className="rounded-xl border border-emerald-500/20 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Present</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-emerald-300">
            {records.filter((r) => r.status === 'present').length}
          </p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">Late</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-yellow-300">
            {records.filter((r) => r.status === 'late').length}
          </p>
        </div>
        <div className="rounded-xl border border-orange-500/20 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Half Day</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-orange-300">
            {records.filter((r) => r.status === 'half-day').length}
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Absent</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-rose-300">
            {records.filter((r) => r.status === 'absent').length}
          </p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">Total Days</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-sky-300">{records.length}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact Heatmap - Smaller version for dashboard widgets
 */
export function CompactHeatmap({ records = [], months = 3 }) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const getStatusForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = records.find((r) => r.date.startsWith(dateStr))
    return record?.status
  }

  const getIntensityClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500'
      case 'late':
        return 'bg-yellow-500'
      case 'half-day':
        return 'bg-orange-500'
      case 'absent':
        return 'bg-rose-500'
      default:
        return 'bg-slate-800/50'
    }
  }

  // Group by weeks
  const weeks = []
  let currentWeek = []
  
  days.forEach((day, index) => {
    currentWeek.push(day)
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const status = getStatusForDate(day)
              return (
                <div
                  key={day.toISOString()}
                  className={clsx(
                    'h-2 w-2 rounded-sm transition-all hover:scale-150',
                    getIntensityClass(status)
                  )}
                  title={`${format(day, 'MMM d')}: ${status || 'No data'}`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
