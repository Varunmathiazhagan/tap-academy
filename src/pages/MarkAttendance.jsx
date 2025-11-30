import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import DashboardLayout from '../components/layout/DashboardLayout' // No change needed
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ModernCard, { NotificationCard } from '../components/common/ModernCard'
import AnimatedButton from '../components/common/AnimatedButton'
import GlassCard, { GlassPanel, GlassStatCard } from '../components/common/GlassCard'
import { DualFloatingButtons } from '../components/attendance/FloatingCheckButton'
import AttendanceTimeline from '../components/attendance/AttendanceTimeline'
import AttendanceHeatmap from '../components/attendance/AttendanceHeatmap'
import ConfettiCelebration from '../components/common/ConfettiCelebration'
import { loadToday, performCheckIn, performCheckOut, loadHistory } from '../features/attendance/attendanceSlice'

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const links = [
  { to: '/employee/dashboard', label: 'Dashboard' },
  { to: '/employee/mark-attendance', label: 'Mark Attendance' },
  { to: '/employee/history', label: 'My Attendance' },
  { to: '/employee/profile', label: 'Profile' },
]

export default function MarkAttendance() {
  const dispatch = useDispatch()
  const { today, loading, error, history } = useSelector((state) => state.attendance)
  const currentTime = new Date()
  
  // State for celebrations and notifications
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastAction, setLastAction] = useState(null) // 'checkin' or 'checkout'
  const [showEarlyBirdCelebration, setShowEarlyBirdCelebration] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    dispatch(loadToday())
    dispatch(loadHistory({ limit: 120 }))
  }, [dispatch])

  const handleCheckIn = async () => {
    try {
      const result = await dispatch(performCheckIn())
      
      // Check if the action was fulfilled (not rejected)
      if (performCheckIn.fulfilled.match(result)) {
        dispatch(loadToday())
        
        // Show early bird celebration if checked in before 9 AM
        const now = new Date()
        if (now.getHours() < 9) {
          setShowEarlyBirdCelebration(true)
        }
        
        setLastAction('checkin')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Check-in failed:', err)
    }
  }

  const handleCheckOut = async () => {
    try {
      const result = await dispatch(performCheckOut())
      
      // Check if the action was fulfilled (not rejected)
      if (performCheckOut.fulfilled.match(result)) {
        dispatch(loadToday())
        setLastAction('checkout')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Check-out failed:', err)
    }
  }

  const getWorkHours = () => {
    if (today?.checkInTime && today?.checkOutTime) {
      return today.totalHours?.toFixed(2) || '0.00'
    }
    if (today?.checkInTime) {
      const hours = (currentTime - new Date(today.checkInTime)) / (1000 * 60 * 60)
      return hours.toFixed(2)
    }
    return '0.00'
  }

  const isCheckedIn = Boolean(today?.checkInTime)
  const isWorkingNow = isCheckedIn && !today?.checkOutTime
  const checkInDate = today?.checkInTime ? new Date(today.checkInTime) : null
  const isLateArrival = today?.status === 'late' || (checkInDate && (checkInDate.getHours() > 9 || (checkInDate.getHours() === 9 && checkInDate.getMinutes() > 5)))

  const last30Records = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    return history.filter((record) => {
      if (!record?.date) return false
      const recordDate = new Date(record.date)
      return recordDate >= cutoff
    })
  }, [history])

  const punctualDays = last30Records.filter((record) => record.status === 'present').length
  const lateDays = last30Records.filter((record) => record.status === 'late').length
  const absentDays = last30Records.filter((record) => record.status === 'absent').length
  const trackedDays = last30Records.length || 1
  const performanceScore = Math.min(100, Math.max(0, Math.round((punctualDays / trackedDays) * 100)))
  const performanceColor = performanceScore >= 85 ? '#34d399' : performanceScore >= 70 ? '#fbbf24' : '#f87171'

  const weekdayStats = useMemo(() => {
    const base = Array.from({ length: 7 }, () => ({ punctual: 0, total: 0, late: 0 }))
    last30Records.forEach((record) => {
      if (!record?.date) return
      const dayIndex = new Date(record.date).getDay()
      base[dayIndex].total += 1
      if (record.status === 'present') base[dayIndex].punctual += 1
      if (record.status === 'late') base[dayIndex].late += 1
    })
    return base
  }, [last30Records])

  const bestWeekdayIndex = useMemo(() => {
    let bestIndex = null
    let bestRatio = 0
    weekdayStats.forEach((stat, index) => {
      if (stat.total === 0) return
      const ratio = stat.punctual / stat.total
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestIndex = index
      }
    })
    return bestIndex
  }, [weekdayStats])

  const lateSpikeDayIndex = useMemo(() => {
    let spikeIndex = null
    let spikeLate = 0
    weekdayStats.forEach((stat, index) => {
      if (stat.late > spikeLate) {
        spikeLate = stat.late
        spikeIndex = index
      }
    })
    return spikeIndex
  }, [weekdayStats])

  const avgHours = useMemo(() => {
    if (last30Records.length === 0) return 0
    const totalHours = last30Records.reduce((sum, record) => sum + (record.totalHours || 0), 0)
    return totalHours / last30Records.length
  }, [last30Records])

  const aiInsights = useMemo(() => {
    const insights = []
    if (bestWeekdayIndex !== null) {
      insights.push(`You were more punctual on ${WEEKDAY_NAMES[bestWeekdayIndex]}s this month.`)
    }
    if (lateSpikeDayIndex !== null && weekdayStats[lateSpikeDayIndex].late > 0) {
      insights.push(`Late arrivals cluster on ${WEEKDAY_NAMES[lateSpikeDayIndex]}s — try prepping earlier the night before.`)
    }
    if (avgHours > 0) {
      insights.push(`Average workday lasted ${avgHours.toFixed(1)} hours over the last 30 days.`)
    }
    if (insights.length === 0) {
      insights.push('Consistency builds unstoppable habits — keep logging your hours!')
    }
    return insights.slice(0, 3)
  }, [avgHours, bestWeekdayIndex, lateSpikeDayIndex, weekdayStats])

  const recommendations = useMemo(() => {
    const list = [
      {
        title: 'Punctuality badge',
        badge: 'Goal',
        body: 'Try checking in before 9:05 AM to earn a punctuality badge.',
      },
    ]

    if (performanceScore < 85) {
      list.push({
        title: 'Micro morning prep',
        badge: 'Tip',
        body: 'Lay out your essentials the night before to shave a few minutes off morning setup.',
      })
    } else {
      list.push({
        title: 'Share your streak',
        badge: 'Win',
        body: 'Mentor a teammate on your routine to reinforce great attendance habits.',
      })
    }

    if (avgHours > 9) {
      list.push({
        title: 'Guard your shutdown',
        badge: 'Balance',
        body: 'Schedule a soft wrap-up alarm to avoid stretching beyond 9 hours daily.',
      })
    } else if (avgHours < 8) {
      list.push({
        title: 'Deep work block',
        badge: 'Focus',
        body: 'Book a 90-minute focus slot after check-in for uninterrupted progress.',
      })
    }

    return list.slice(0, 3)
  }, [avgHours, performanceScore])

  const timelineRecord = selectedRecord || today
  const timelineCurrentTime = selectedRecord
    ? new Date(selectedRecord.checkOutTime || selectedRecord.checkInTime || selectedRecord.date || new Date())
    : currentTime

  const statusLabel = isWorkingNow
    ? 'Clocked in — working'
    : isCheckedIn
      ? today?.checkOutTime
        ? 'Day completed'
        : isLateArrival
          ? 'Late arrival'
          : 'Checked in'
      : 'Awaiting check-in'

  const statusMessage = isWorkingNow
    ? 'Timer is running. Remember to check out when you wrap up.'
    : isCheckedIn
      ? today?.checkOutTime
        ? 'Great job closing the loop today.'
        : isLateArrival
          ? 'Next target: arrive before 9:05 AM to stay green.'
          : 'You are all set. Keep your productivity streak alive!'
      : 'Tap the check-in button to start your day.'

  const handleDaySelect = (date, record) => {
    setSelectedRecord(record)
  }

  const resetTimeline = () => setSelectedRecord(null)

  return (
    <DashboardLayout title="Mark Attendance" links={links}>
      {/* Celebrations */}
      <ConfettiCelebration
        trigger={showEarlyBirdCelebration}
        type="achievement"
        message="Early Bird! 🌅"
        onComplete={() => setShowEarlyBirdCelebration(false)}
      />

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <LoadingSpinner size="md" text="Updating attendance..." />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <NotificationCard
              type="error"
              title="Attendance Error"
              message={error}
              onClose={() => {/* Handle error dismiss */}}
            />
          )}
        </AnimatePresence>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <NotificationCard
              type="success"
              title="Success!"
              message={lastAction === 'checkout' ? "Successfully checked out!" : "Successfully checked in!"}
              onClose={() => setShowSuccess(false)}
            />
          )}
        </AnimatePresence>

        {/* Neo Glass Hero Section */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Floating Background */}
          <div className="absolute inset-0 gradient-bg-dark" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-600/30 rounded-full blur-3xl -translate-y-40 translate-x-40" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-blue-500/30 rounded-full blur-2xl translate-y-30 -translate-x-30" />
          
          <GlassCard
            neonColor="cyan"
            intensity="ultra"
            className="glass-morphism-ultra backdrop-blur-3xl border-cyan-400/20"
            floating={true}
          >
            <div className="p-4 sm:p-6 md:p-8 text-center">
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gradient-neon"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Mark Your Attendance
              </motion.h1>
              <motion.p
                className="text-white/80 text-sm sm:text-base md:text-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </motion.p>
            </div>

          {/* Floating Check Buttons */}
          <motion.div
            className="mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <DualFloatingButtons
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              hasCheckedIn={Boolean(today?.checkInTime)}
              hasCheckedOut={Boolean(today?.checkOutTime)}
              loading={loading}
            />
          </motion.div>

            {/* Neo Glass Status Grid */}
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mt-6 sm:mt-8">
              <GlassStatCard
                title="Current Status"
                value={<StatusBadge status={today?.status ?? 'not-checked-in'} />}
                neonColor="emerald"
                delay={0}
                icon="🟢"
              />
              
              <GlassStatCard
                title="Check In Time"
                value={today?.checkInTime ? 
                  new Date(today.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '—'
                }
                description={today?.checkInTime ? 'Arrived on time' : 'Not checked in'}
                neonColor="sky"
                delay={1}
                icon="⏰"
              />
              
              <GlassStatCard
                title="Check Out Time"
                value={today?.checkOutTime ? 
                  new Date(today.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '—'
                }
                description={today?.checkOutTime ? 'Day completed' : 'Still working'}
                neonColor="purple"
                delay={2}
                icon="🚪"
              />
              
              <GlassStatCard
                title="Work Hours"
                value={`${getWorkHours()} hrs`}
                description="Today's total"
                neonColor="amber"
                delay={3}
                icon="⚡"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Today's Status Capsule */}
        <motion.section
          className={clsx(
            'relative overflow-hidden rounded-[40px] border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.6)] status-capsule',
            isLateArrival && 'status-capsule-late'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={clsx(
              'status-wave',
              isCheckedIn && 'status-wave-active',
              isLateArrival && 'status-wave-late'
            )}
          />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Today’s Attendance Status</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <h2 className="text-3xl font-bold text-white">{statusLabel}</h2>
                <span
                  className={clsx(
                    'rounded-full px-4 py-1 text-xs font-semibold tracking-wide backdrop-blur border',
                    isLateArrival
                      ? 'border-rose-400/40 bg-rose-500/10 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                      : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                  )}
                >
                  {today?.status ? today.status.replace('-', ' ') : 'not started'}
                </span>
              </div>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">{statusMessage}</p>

              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                {[{
                  label: 'Check-in',
                  value: today?.checkInTime
                    ? new Date(today.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '—',
                  accent: 'emerald',
                }, {
                  label: 'Check-out',
                  value: today?.checkOutTime
                    ? new Date(today.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : isWorkingNow ? 'Working…' : '—',
                  accent: 'rose',
                }, {
                  label: 'Tracked hours',
                  value: `${getWorkHours()} hrs`,
                  accent: 'sky',
                }].map((item) => (
                  <div key={item.label} className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 self-center">
              {isWorkingNow && (
                <div className="status-clock scale-75 sm:scale-90 md:scale-100">
                  <span className="status-clock-center" />
                  <span className="status-clock-hand" />
                  <span className="status-clock-hand status-clock-hand--minutes" />
                </div>
              )}
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 px-4 sm:px-6 py-4 sm:py-5 text-center sm:text-right w-full sm:w-auto">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next milestone</p>
                <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-white">09:00 AM</p>
                <p className="text-xs sm:text-sm text-slate-400">Target check-in</p>
                <AnimatedButton className="mt-3 sm:mt-4 w-full sm:w-auto" variant="primary">
                  View streaks
                </AnimatedButton>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Monthly Performance + Recommendations */}
        <motion.section className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <GlassPanel
            title="Monthly Performance Score"
            subtitle="Past 30 days"
            neonColor="emerald"
            headerGradient={false}
            titleTone="solid"
          >
            <div className="flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-center">
              <div className="relative mx-auto h-36 w-36 sm:h-44 sm:w-44">
                <div
                  className="circular-progress"
                  style={{ background: `conic-gradient(${performanceColor} ${performanceScore}%, rgba(15,23,42,0.8) ${performanceScore}% 100%)` }}
                >
                  <div className="circular-progress__inner">
                    <span className="text-4xl font-black text-white">{performanceScore}<span className="text-base font-semibold">%</span></span>
                    <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">Score</p>
                  </div>
                </div>
                <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-emerald-500/10 blur-2xl" />
              </div>
              <div className="flex-1 space-y-4 sm:space-y-5">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-3 sm:grid-cols-3">
                  {[{
                    label: 'On-time days',
                    value: punctualDays,
                    tone: 'text-emerald-300'
                  }, {
                    label: 'Late marks',
                    value: lateDays,
                    tone: 'text-amber-300'
                  }, {
                    label: 'Absences',
                    value: absentDays,
                    tone: 'text-rose-300'
                  }].map((stat) => (
                    <div key={stat.label} className="rounded-xl sm:rounded-2xl border border-white/5 bg-white/5 p-3 sm:p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</p>
                      <p className={clsx('mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold', stat.tone)}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">A.I. powered insights</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {aiInsights.map((insight, index) => (
                      <li key={insight} className="flex items-start gap-2">
                        <span className="text-emerald-400">{index === 0 ? '✦' : '•'}</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel
            title="Smart Recommendations"
            subtitle="Generated just for you"
            neonColor="pink"
            headerGradient={false}
            titleTone="solid"
          >
            <div className="space-y-4">
              {recommendations.map((item) => (
                <div key={item.title} className="rounded-2xl border border-pink-400/20 bg-pink-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-white">{item.title}</h4>
                    <span className="text-xs uppercase tracking-widest text-pink-300">{item.badge}</span>
                  </div>
                  <p className="mt-2 text-sm text-pink-100/80">{item.body}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.section>

        {/* Heatmap + Timeline Combo */}
        <motion.section className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <AttendanceHeatmap
              records={history}
              year={new Date().getFullYear()}
              onDayClick={handleDaySelect}
            />
          </div>
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/40 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Timeline focus</p>
                <p className="text-lg font-semibold text-white">{selectedRecord ? new Date(selectedRecord.date || selectedRecord.checkInTime).toLocaleDateString() : 'Today'}</p>
              </div>
              {selectedRecord && (
                <button
                  type="button"
                  onClick={resetTimeline}
                  className="text-xs font-semibold uppercase tracking-widest text-sky-300 hover:text-sky-200"
                >
                  Reset
                </button>
              )}
            </div>
            <AttendanceTimeline record={timelineRecord} currentTime={timelineCurrentTime} />
          </div>
        </motion.section>

        {/* Guidelines Card */}
        <ModernCard className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <motion.div
              className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            
            <div className="flex-1">
              <motion.h3
                className="font-bold text-white text-base sm:text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Attendance Guidelines
              </motion.h3>
              
              <motion.ul
                className="mt-4 space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[
                  {
                    icon: "✅",
                    color: "text-green-600",
                    text: "Check in when you start your workday and check out when you finish"
                  },
                  {
                    icon: "⏰",
                    color: "text-amber-600",
                    text: "Arrivals after 9:15 AM will be marked as late"
                  },
                  {
                    icon: "⚠️",
                    color: "text-red-600",
                    text: "Contact your manager if you miss a check-in or need to correct your record"
                  }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-slate-300 text-sm">{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </ModernCard>
      </motion.div>
    </DashboardLayout>
  )
}
