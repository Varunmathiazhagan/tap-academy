import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

/**
 * Employee Timeline View
 * Shows horizontal timeline of check-in, breaks, and check-out times
 * With clock animation and red glow for late status
 */
export default function AttendanceTimeline({ record, currentTime = new Date() }) {
  const [animatedTime, setAnimatedTime] = useState(new Date())

  // Update time every second for live clock animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!record) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
        <p className="text-sm text-slate-400">No attendance data for today</p>
      </div>
    )
  }

  const checkInTime = record.checkInTime ? new Date(record.checkInTime) : null
  const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null
  
  // Work day timeline: 8 AM to 6 PM (10 hours)
  const dayStart = new Date(currentTime)
  dayStart.setHours(8, 0, 0, 0)
  const dayEnd = new Date(currentTime)
  dayEnd.setHours(18, 0, 0, 0)
  
  const totalMinutes = (dayEnd - dayStart) / (1000 * 60)
  
  const getPosition = (time) => {
    if (!time) return 0
    const minutes = (time - dayStart) / (1000 * 60)
    return Math.max(0, Math.min(100, (minutes / totalMinutes) * 100))
  }

  const checkInPosition = checkInTime ? getPosition(checkInTime) : 0
  const checkOutPosition = checkOutTime ? getPosition(checkOutTime) : 100
  const currentPosition = getPosition(currentTime)

  const workDuration = checkInTime && (checkOutTime || currentTime)
    ? ((checkOutTime || currentTime) - checkInTime) / (1000 * 60 * 60)
    : 0

  const isLate = record.status === 'late'
  const isWorking = checkInTime && !checkOutTime

  return (
    <motion.div 
      className={clsx(
        "space-y-4 sm:space-y-6 rounded-2xl border p-4 sm:p-5 md:p-6 shadow-xl",
        isLate 
          ? "border-rose-500/30 bg-gradient-to-br from-rose-900/20 via-slate-900/30 to-transparent" 
          : "border-slate-700/40 bg-gradient-to-br from-slate-900/30 to-transparent"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Red glow animation for late status */}
      {isLate && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-rose-500/10 pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">Today's Timeline</h3>
            {isLate && (
              <motion.span 
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/40"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Late Arrival
              </motion.span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isWorking ? 'Active Time' : 'Work Duration'}
          </p>
          <div className="flex items-center gap-2 justify-end">
            <motion.p 
              className="mt-1 text-2xl font-bold text-white"
              key={workDuration.toFixed(1)}
              initial={{ scale: 1.2, color: '#60a5fa' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.3 }}
            >
              {workDuration.toFixed(1)} <span className="text-sm text-slate-400">hrs</span>
            </motion.p>
            {isWorking && <LiveClockIndicator />}
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Hour markers */}
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>8 AM</span>
          <span>10 AM</span>
          <span>12 PM</span>
          <span>2 PM</span>
          <span>4 PM</span>
          <span>6 PM</span>
        </div>

        {/* Timeline bar */}
        <div className="relative h-16 rounded-full border border-slate-700 bg-slate-900/80">
          {/* Background segments */}
          <div className="absolute inset-0 flex rounded-full overflow-hidden">
            <div className="flex-1 border-r border-slate-700" />
            <div className="flex-1 border-r border-slate-700" />
            <div className="flex-1 border-r border-slate-700" />
            <div className="flex-1 border-r border-slate-700" />
            <div className="flex-1" />
          </div>

          {/* Active work period */}
          {checkInTime && (
            <div
              className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-emerald-500/30 to-sky-500/30 backdrop-blur-sm transition-all duration-500"
              style={{
                left: `${checkInPosition}%`,
                right: `${100 - checkOutPosition}%`,
              }}
            />
          )}

          {/* Check-in marker */}
          {checkInTime && (
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${checkInPosition}%` }}
            >
              <div className="group relative">
                <motion.div 
                  className={clsx(
                    "flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 shadow-lg transition-all hover:scale-125",
                    isLate 
                      ? "border-rose-500 bg-rose-500/20 shadow-rose-500/50"
                      : "border-emerald-500 bg-emerald-500/20 shadow-emerald-500/50"
                  )}
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className={clsx("h-6 w-6", isLate ? "text-rose-300" : "text-emerald-300")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </motion.div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl group-hover:block z-20">
                  Check In: {format(checkInTime, 'h:mm a')}
                  {isLate && <div className="text-rose-300 font-semibold mt-1">⚠️ Late</div>}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
          )}

          {/* Check-out marker */}
          {checkOutTime && (
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${checkOutPosition}%` }}
            >
              <div className="group relative">
                <div className="flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-rose-500 bg-rose-500/20 shadow-lg shadow-rose-500/50 transition-all hover:scale-125">
                  <svg className="h-6 w-6 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                  </svg>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                  Check Out: {format(checkOutTime, 'h:mm a')}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
          )}

          {/* Current time indicator (if still working) */}
          {checkInTime && !checkOutTime && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${currentPosition}%` }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <div className="h-14 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-400 to-purple-500 shadow-lg shadow-sky-500/50" />
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LiveClock time={animatedTime} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Time labels */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={clsx("h-3 w-3 rounded-full", isLate ? "bg-rose-500" : "bg-emerald-500")} />
            <span className="text-slate-300">
              Check In: {checkInTime ? format(checkInTime, 'h:mm a') : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-slate-300">
              Check Out: {checkOutTime ? format(checkOutTime, 'h:mm a') : isWorking ? 'Working...' : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-700/40 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
          <div className="mt-2">
            <span className={clsx(
              'inline-block rounded-full px-3 py-1 text-xs font-bold uppercase',
              record.status === 'present' && 'bg-emerald-500/20 text-emerald-300',
              record.status === 'late' && 'bg-yellow-500/20 text-yellow-300',
              record.status === 'absent' && 'bg-rose-500/20 text-rose-300',
              record.status === 'half-day' && 'bg-orange-500/20 text-orange-300'
            )}>
              {record.status}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/40 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Break Time</p>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg font-bold text-white">
            {/* Placeholder for future break tracking */}
            0 min
          </p>
        </div>

        <div className="rounded-xl border border-slate-700/40 bg-transparent p-3 sm:p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Hours</p>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg font-bold text-white">
            {record.totalHours?.toFixed(2) || workDuration.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Live Clock Indicator - Shows current time while working
 */
function LiveClock({ time }) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-lg border border-sky-500/50 bg-slate-900/90 px-3 py-1.5 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>
      <span className="text-xs font-bold text-sky-300">
        {format(time, 'h:mm:ss a')}
      </span>
    </motion.div>
  )
}

/**
 * Live Clock Indicator Badge
 */
function LiveClockIndicator() {
  return (
    <motion.div
      className="flex items-center gap-1 text-emerald-400"
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-xs font-medium">Live</span>
    </motion.div>
  )
}
