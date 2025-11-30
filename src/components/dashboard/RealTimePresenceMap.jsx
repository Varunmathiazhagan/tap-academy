import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import StatusBadge from '../common/StatusBadge'
import { formatISTTime } from '../../utils/helpers'

const getInitials = (name = '') => {
  if (!name) return 'NA'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const getAvatarColor = (name = '') => {
  const colors = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-500',
  ]
  const index = name.length % colors.length
  return colors[index]
}

export default function RealTimePresenceMap({ records = [] }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every 30 seconds for live distance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkedInRecords = records.filter((record) => Boolean(record?.checkInTime))
  const activeNow = checkedInRecords.filter((record) => !record?.checkOutTime)
  const spotlight = checkedInRecords.slice(0, 12)

  const departmentStats = checkedInRecords.reduce((acc, record) => {
    const dept = record?.user?.department || 'General'
    if (!acc[dept]) {
      acc[dept] = { total: 0, active: 0 }
    }
    acc[dept].total += 1
    if (!record?.checkOutTime) {
      acc[dept].active += 1
    }
    return acc
  }, {})

  return (
    <motion.div
      className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/80 p-6 shadow-2xl backdrop-blur-sm overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated background gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-48 translate-x-48 animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-xl">🌍</span>
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Manager Dashboard · Live</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Real-time Presence Map</h3>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Live avatars of everyone who checked in today · Updated {formatISTTime(currentTime)}
            </p>
          </div>
          
          <motion.span 
            className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-emerald-200 backdrop-blur-sm"
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(52, 211, 153, 0)',
                '0 0 0 10px rgba(52, 211, 153, 0.1)',
                '0 0 0 0 rgba(52, 211, 153, 0)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="relative flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {activeNow.length} active now
            </span>
          </motion.span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {spotlight.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center py-12"
              >
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50 mb-4">
                  <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">No live check-ins yet.</p>
                <p className="text-xs text-slate-500 mt-1">This section updates the moment your team arrives.</p>
              </motion.div>
            ) : (
              spotlight.map((record, index) => {
                const isActive = !record?.checkOutTime
                const statusLabel = record?.status?.replace('-', ' ') || 'present'
                const checkInDistance = record?.checkInTime
                  ? formatDistanceToNow(new Date(record.checkInTime), { addSuffix: true })
                  : '—'

                return (
                  <PresenceCard 
                    key={record?._id} 
                    record={record}
                    isActive={isActive}
                    checkInDistance={checkInDistance}
                    index={index}
                    statusLabel={statusLabel}
                  />
                )
              })
            )}
          </AnimatePresence>
          </div>

        {/* Department Coverage Stats */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Department Coverage</p>
          </div>
          
          {Object.keys(departmentStats).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Invite your team to check in to populate this view.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(departmentStats).map(([dept, stats], index) => (
                <motion.div 
                  key={dept} 
                  className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <p className="text-xs uppercase tracking-widest text-slate-400">{dept}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-white">{stats.active}</p>
                    <span className="text-slate-500 text-lg">/ {stats.total}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">active / checked-in</p>
                  
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.active / stats.total) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Individual Presence Card Component
 */
function PresenceCard({ record, isActive, checkInDistance, index, statusLabel }) {
  const avatarGradient = getAvatarColor(record?.user?.name)
  
  return (
    <motion.div
      className="group relative rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-4 backdrop-blur-sm hover:border-slate-700 transition-all"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: index * 0.05 
      }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Glow effect for active users */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 -z-10"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="flex items-center gap-4">
        {/* Avatar with gradient and glow */}
        <div className="relative flex-shrink-0">
          <motion.div 
            className={clsx(
              'flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br font-bold text-white text-lg shadow-lg border-2',
              avatarGradient,
              isActive ? 'border-emerald-400/50' : 'border-slate-700'
            )}
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {getInitials(record?.user?.name)}
          </motion.div>
          
          {/* Active indicator with pulse animation */}
          {isActive && (
            <motion.span 
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-100"></span>
              </span>
            </motion.span>
          )}
          
          {/* Offline indicator */}
          {!isActive && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span>
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-white truncate">
            {record?.user?.name || 'Unnamed Employee'}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {record?.user?.employeeId || '—'} • {record?.user?.department || 'General'}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {checkInDistance}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={record?.status || 'present'} />
              <span className="text-[11px] uppercase tracking-wide text-slate-500">{statusLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect border glow */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-slate-700 transition-all pointer-events-none" />
    </motion.div>
  )
}
