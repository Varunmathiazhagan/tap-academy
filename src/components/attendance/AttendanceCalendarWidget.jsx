import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useCallback } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday 
} from 'date-fns'
import clsx from 'clsx'

/**
 * Modern Animated Calendar Widget
 * Features smooth transitions, hover effects, and attendance visualization
 */
export default function AttendanceCalendarWidget({
  attendanceData = {},
  selectedDate = new Date(),
  onDateSelect,
  onMonthChange,
  showStats = true,
  className
}) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)
  const [direction, setDirection] = useState(0)

  // Calendar calculations
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = useMemo(() => {
    const grid = []
    let cursor = startDate
    while (cursor <= endDate) {
      grid.push(cursor)
      cursor = addDays(cursor, 1)
    }
    return grid
  }, [startDate, endDate])

  // Navigate months
  const nextMonth = () => {
    setDirection(1)
    const newMonth = addMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const prevMonth = () => {
    setDirection(-1)
    const newMonth = subMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  // Get attendance status for a date
  const getAttendanceStatus = useCallback((date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return attendanceData[dateKey]
  }, [attendanceData])

  // Calculate stats
  const monthStats = useMemo(() => {
    const monthDays = days.filter(day => isSameMonth(day, currentMonth))
    const workDays = monthDays.filter(day => {
      const dayOfWeek = day.getDay()
      return dayOfWeek !== 0 && dayOfWeek !== 6 // Exclude weekends
    })

    const presentDays = workDays.filter(day => {
      const status = getAttendanceStatus(day)
      return status === 'present' || status === 'check-in'
    })

    const attendanceRate = workDays.length > 0 ? Math.round((presentDays.length / workDays.length) * 100) : 0

    return {
      workDays: workDays.length,
      presentDays: presentDays.length,
      attendanceRate
    }
  }, [days, currentMonth, getAttendanceStatus])

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <div className={clsx('bg-slate-900/60 rounded-2xl shadow-card border border-slate-800 overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={prevMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={format(currentMonth, 'MMMM yyyy')}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="text-xl font-bold"
            >
              {format(currentMonth, 'MMMM yyyy')}
            </motion.h2>
          </AnimatePresence>

          <motion.button
            onClick={nextMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Stats */}
        {showStats && (
          <motion.div
            className="mt-4 grid grid-cols-3 gap-4 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <p className="text-indigo-100 text-xs">Work Days</p>
              <p className="text-2xl font-bold">{monthStats.workDays}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-xs">Present</p>
              <p className="text-2xl font-bold">{monthStats.presentDays}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-xs">Rate</p>
              <p className="text-2xl font-bold">{monthStats.attendanceRate}%</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-slate-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-slate-400 bg-slate-800/30">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={format(currentMonth, 'MMMM yyyy')}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="grid grid-cols-7"
        >
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)
            const attendanceStatus = getAttendanceStatus(day)
            const isWeekend = day.getDay() === 0 || day.getDay() === 6

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => onDateSelect?.(day)}
                className={clsx(
                  'relative h-12 p-2 text-sm font-medium transition-all duration-200 hover:bg-slate-800/50',
                  !isCurrentMonth && 'text-slate-600',
                  isCurrentMonth && 'text-slate-200',
                  isWeekend && 'bg-slate-800/20',
                  isTodayDate && 'bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30',
                  isSelected && 'bg-blue-500 text-white',
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{format(day, 'd')}</span>

                {/* Attendance indicator */}
                {attendanceStatus && isCurrentMonth && (
                  <motion.div
                    className={clsx(
                      'absolute inset-0 rounded',
                      attendanceStatus === 'present' && 'bg-green-500/20 border border-green-500/30',
                      attendanceStatus === 'absent' && 'bg-red-500/20 border border-red-500/30',
                      attendanceStatus === 'partial' && 'bg-yellow-500/20 border border-yellow-500/30',
                      attendanceStatus === 'check-in' && 'bg-blue-500/20 border border-blue-500/30'
                    )}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                )}

                {/* Attendance status dot */}
                {attendanceStatus && isCurrentMonth && (
                  <div
                    className={clsx(
                      'absolute bottom-1 right-1 w-2 h-2 rounded-full',
                      attendanceStatus === 'present' && 'bg-green-500',
                      attendanceStatus === 'absent' && 'bg-red-500',
                      attendanceStatus === 'partial' && 'bg-yellow-500',
                      attendanceStatus === 'check-in' && 'bg-blue-500'
                    )}
                  />
                )}

                {/* Today indicator ring */}
                {isTodayDate && !isSelected && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none" />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-slate-300">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-slate-300">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="text-slate-300">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-slate-300">Check-in</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact Calendar Widget - for smaller spaces
 */
export function CompactCalendarWidget({ 
  attendanceData = {}, 
  selectedDate = new Date(),
  className 
}) {
  const monthStats = useMemo(() => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(monthStart)
    
    let presentDays = 0
    let totalDays = 0
    
    let day = monthStart
    while (day <= monthEnd) {
      const dayOfWeek = day.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        totalDays++
        const dateKey = format(day, 'yyyy-MM-dd')
        const status = attendanceData[dateKey]
        if (status === 'present' || status === 'check-in') {
          presentDays++
        }
      }
      day = addDays(day, 1)
    }

    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    
    return { presentDays, totalDays, attendanceRate }
  }, [selectedDate, attendanceData])

  return (
    <motion.div
      className={clsx(
        'bg-gradient-to-br from-indigo-900/50 to-indigo-800/40 rounded-xl p-4 border border-indigo-700/40 shadow-card',
        className
      )}
      whileHover={{ y: -2, shadow: "0 8px 25px rgba(79,70,229,0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-white">
          {format(selectedDate, 'MMM yyyy')}
        </h3>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-indigo-300">
            {monthStats.attendanceRate}%
          </div>
          <div className="text-xs text-slate-400">
            {monthStats.presentDays} of {monthStats.totalDays} days
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${monthStats.attendanceRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}
