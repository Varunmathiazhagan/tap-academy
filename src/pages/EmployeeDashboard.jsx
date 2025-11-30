import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoadingSpinner, { DashboardSkeleton } from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import StatCard from '../components/common/StatCard'
import ModernCard from '../components/common/ModernCard'
import GlassCard, { GlassPanel, GlassStatCard, GlassButton } from '../components/common/GlassCard'
import AttendanceTimeline from '../components/attendance/AttendanceTimeline'
import AttendanceTable from '../components/attendance/AttendanceTable'
import AttendanceCalendarWidget, { CompactCalendarWidget } from '../components/attendance/AttendanceCalendarWidget'
import ConfettiCelebration, { AchievementToast } from '../components/common/ConfettiCelebration'
import EnhancedStatCard, { ScoreCard } from '../components/dashboard/EnhancedStatCard'
import QuickActionPanel from '../components/dashboard/QuickActionPanel'
import MonthlyPerformanceScore from '../components/dashboard/MonthlyPerformanceScore'
import SmartInsights, { SmartRecommendations } from '../components/dashboard/SmartInsights'
import { HoursWorkedChart, AttendanceDistributionChart } from '../components/dashboard/AdvancedCharts'
import { CompactHeatmap } from '../components/attendance/AttendanceHeatmap'
import { DualFloatingButtons } from '../components/attendance/FloatingCheckButton'
import { loadEmployeeDashboard } from '../features/dashboard/dashboardSlice'
import { loadToday, performCheckIn, performCheckOut } from '../features/attendance/attendanceSlice'
import { 
  selectAttendanceMetrics, 
  selectAttendanceScore,
  selectBadgeProgress 
} from '../features/performance/performanceSlice'

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const employeeLinks = [
  { to: '/employee/dashboard', label: 'Dashboard' },
  { to: '/employee/mark-attendance', label: 'Mark Attendance' },
  { to: '/employee/history', label: 'My Attendance' },
  { to: '/employee/profile', label: 'Profile' },
]

export default function EmployeeDashboard() {
  const dispatch = useDispatch()
  const { employee } = useSelector((state) => state.dashboard)
  const { today } = useSelector((state) => state.attendance)
  const { user } = useSelector((state) => state.auth)
  
  // Redux selectors for computed values
  const metrics = useSelector(selectAttendanceMetrics)
  const attendanceScore = useSelector(selectAttendanceScore)
  const badgeProgress = useSelector(selectBadgeProgress)

  // New state for modern features
  const [showPerfectAttendanceConfetti, setShowPerfectAttendanceConfetti] = useState(false)
  const [showAchievementToast, setShowAchievementToast] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date())

  useEffect(() => {
    dispatch(loadEmployeeDashboard())
    dispatch(loadToday())
  }, [dispatch])

  const handleCheckIn = async () => {
    try {
      const result = await dispatch(performCheckIn())
      
      // Only proceed if action was fulfilled
      if (performCheckIn.fulfilled.match(result)) {
        dispatch(loadEmployeeDashboard())
        dispatch(loadToday())
        
        // Show achievement toast for early check-in
        const now = new Date()
        if (now.getHours() <= 9) {
          setShowAchievementToast(true)
        }
      }
    } catch (err) {
      console.error('Check-in failed:', err)
    }
  }

  const handleCheckOut = async () => {
    try {
      const result = await dispatch(performCheckOut())
      
      // Only proceed if action was fulfilled
      if (performCheckOut.fulfilled.match(result)) {
        dispatch(loadEmployeeDashboard())
        dispatch(loadToday())
        
        // Check for perfect attendance month achievement
        if (dashboardData && attendanceScore >= 100) {
          setShowPerfectAttendanceConfetti(true)
        }
      }
    } catch (err) {
      console.error('Check-out failed:', err)
    }
  }

  const dashboardData = employee.data
  const timelineRecord = today ?? dashboardData?.recent?.[0] ?? null

  // Create attendance data for calendar
  const attendanceCalendarData = {}
  if (dashboardData?.recent) {
    dashboardData.recent.forEach(record => {
      const dateKey = new Date(record.date).toISOString().split('T')[0]
      attendanceCalendarData[dateKey] = record.status
    })
  }

  return (
    <DashboardLayout title="Employee Dashboard" links={employeeLinks}>
      {/* Professional Skeleton Loading State */}
      <AnimatePresence mode="wait">
        {employee.status === 'loading' && !dashboardData && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <DashboardSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Celebrations */}
      <ConfettiCelebration
        trigger={showPerfectAttendanceConfetti}
        type="perfect-attendance"
        message="Perfect Attendance!"
        onComplete={() => setShowPerfectAttendanceConfetti(false)}
      />

      {/* Achievement Toast */}
      <AchievementToast
        visible={showAchievementToast}
        title="Early Bird! 🌅"
        subtitle="Checked in before 9 AM"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
        onClose={() => setShowAchievementToast(false)}
      />

      <AnimatePresence mode="wait">
        {dashboardData && (
          <motion.div
            key="content"
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {/* Neo Glassmorphism Welcome Banner */}
            <motion.div
              className="relative overflow-hidden"
              variants={itemVariants}
            >
              {/* Floating Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-95" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-sky-400/10 to-transparent rounded-full blur-3xl -translate-y-48 translate-x-48 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-500/15 via-cyan-500/10 to-transparent rounded-full blur-2xl translate-y-36 -translate-x-36" />
              
              <GlassCard
                className="glass-morphism-ultra backdrop-blur-3xl border border-cyan-400/30 shadow-[0_25px_50px_-12px_rgba(14,165,233,0.35)]"
                neonColor="cyan"
                intensity="ultra"
                floating={true}
              >
                <div className="relative p-4 sm:p-6 md:p-8">
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <motion.h2
                      className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-aurora"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </motion.h2>
                    <motion.p
                      className="mt-2 sm:mt-3 text-cyan-100/80 text-sm sm:text-base md:text-lg"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </motion.p>
                    
                    {/* Quick Status */}
                    <motion.div
                      className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 sm:px-3 py-1.5 sm:py-2 text-cyan-100">
                        <StatusBadge status={today?.status ?? dashboardData.todayStatus} />
                        <span className="text-xs sm:text-sm font-medium">Today's Status</span>
                      </div>
                      {today?.checkInTime && (
                        <div className="flex items-center gap-2 text-slate-100 text-xs sm:text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          In at {new Date(today.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-2xl border border-cyan-400/30">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </motion.div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

            {/* Neo Glassmorphism KPI Cards */}
            <motion.div 
              className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              variants={itemVariants}
            >
              <GlassStatCard
                title="Attendance Score"
                value={`${attendanceScore}%`}
                description="Monthly performance"
                trend={attendanceScore >= 90 ? 2 : undefined}
                neonColor="cyan"
                delay={0}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <GlassStatCard
                title="Total Hours"
                value={dashboardData.summary.totalHours ?? 0}
                description="This month"
                trend={5}
                neonColor="emerald"
                delay={1}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <GlassStatCard
                title="Present Days"
                value={dashboardData.summary.present ?? 0}
                description={`Out of ${metrics.totalDays} days`}
                neonColor="sky"
                delay={2}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6 6 6-6" />
                  </svg>
                }
              />
              
              <GlassStatCard
                title="Late Percentage"
                value={`${metrics.latePercentage}%`}
                description={`${dashboardData.summary.late ?? 0} late arrivals`}
                trend={metrics.latePercentage < 10 ? -2 : undefined}
                neonColor={metrics.latePercentage > 15 ? "amber" : "cyan"}
                delay={3}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </motion.div>

          <motion.div className="section-shell" variants={itemVariants}>
            <div className="section-shell__inner">
              <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
                <div className="xl:col-span-3 lg:col-span-1">
                  <MonthlyPerformanceScore />
                </div>
                <div className="xl:col-span-3 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  <SmartInsights />
                  <SmartRecommendations />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kudos / Gamification */}
          {badgeProgress ? (
            <motion.div className="section-shell" variants={itemVariants}>
              <div className="section-shell__inner space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Kudos & Stars</p>
                    <h3 className="mt-1 text-2xl font-bold text-gradient-aurora">Great job staying on time!</h3>
                    <p className="text-sm text-slate-400">
                      {badgeProgress.onTimeDays} on-time days this month out of {badgeProgress.workingDays || '—'} tracked days.
                    </p>
                  </div>
                  <div className="w-full md:w-72">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Progress to next badge</span>
                      <span>{badgeProgress.progressToNext}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                        style={{ width: `${badgeProgress.progressToNext}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {badgeProgress.nextBadge
                        ? `${badgeProgress.nextBadge.threshold - badgeProgress.onTimeDays} more on-time days for ${badgeProgress.nextBadge.label}`
                        : 'You earned every star this month!'}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {badgeProgress.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-2xl border bg-gradient-to-br ${badge.color} p-4 shadow-lg shadow-black/30 ${
                        badge.achieved ? 'opacity-100' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gradient-aurora">{badge.label}</h4>
                        <span className="text-sm text-white/80">
                          {badge.achieved ? 'Unlocked' : `${Math.min(100, Math.round((badgeProgress.onTimeDays / badge.threshold) * 100))}%`}
                        </span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-wide text-white/70">{badge.requirement}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        {badge.achieved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Earned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/40 px-2 py-1 text-slate-200">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-.661a1 1 0 01.833 1.618l-3.29 4.023a1 1 0 00-.244.69l.41 4.738a1 1 0 01-1.45.964L12 19.347l-3.812 2.025a1 1 0 01-1.45-.964l.41-4.738a1 1 0 00-.244-.69l-3.29-4.023a1 1 0 01.833-1.618L9 10l1.8-4.2a1 1 0 011.842 0L15 10z" />
                            </svg>
                            Keep going
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}

          <motion.div className="section-shell" variants={itemVariants}>
            <div className="section-shell__inner">
              <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
                <div className="xl:col-span-1">
                  <QuickActionPanel
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    hasCheckedIn={Boolean(today?.checkInTime)}
                    hasCheckedOut={Boolean(today?.checkOutTime)}
                    loading={employee.status === 'loading'}
                    weeklyData={dashboardData.recent?.slice(-7) ?? []}
                  />
                </div>

                <div className="xl:col-span-2">
                  <GlassCard neonColor="purple" intensity="medium" className="overflow-hidden">
                    <AttendanceCalendarWidget
                      attendanceData={attendanceCalendarData}
                      selectedDate={selectedCalendarDate}
                      onDateSelect={setSelectedCalendarDate}
                      showStats={true}
                    />
                  </GlassCard>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="section-shell" variants={itemVariants}>
            <div className="section-shell__inner">
              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 xl:grid-cols-2">
                <AttendanceTimeline record={timelineRecord} />

                <ModernCard className="space-y-4 card-surface-accent text-white">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gradient-aurora">Recent Activity</h3>
                      <p className="text-xs sm:text-sm text-slate-400">Last {dashboardData.recent?.length ?? 0} check-ins</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <LegendPill color="bg-emerald-500" label="Present" />
                      <LegendPill color="bg-yellow-500" label="Late" />
                      <LegendPill color="bg-orange-500" label="Half Day" />
                      <LegendPill color="bg-rose-500" label="Absent" />
                    </div>
                  </div>

                  <CompactHeatmap records={dashboardData.recent ?? []} months={3} />

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <SummaryStat label="Present" value={dashboardData.summary.present ?? 0} accent="text-emerald-400" />
                    <SummaryStat label="Late" value={dashboardData.summary.late ?? 0} accent="text-yellow-400" />
                    <SummaryStat label="Half Day" value={dashboardData.summary['half-day'] ?? 0} accent="text-orange-400" />
                    <SummaryStat label="Absent" value={dashboardData.summary.absent ?? 0} accent="text-rose-400" />
                  </div>
                </ModernCard>
              </div>
            </div>
          </motion.div>

          <motion.div className="section-shell" variants={itemVariants}>
            <div className="section-shell__inner">
              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 lg:grid-cols-2">
                <HoursWorkedChart 
                  data={dashboardData.recent?.slice(-7).map(r => ({
                    date: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    hours: r.totalHours || 0
                  })) ?? []}
                />
                <AttendanceDistributionChart
                  data={{
                    present: dashboardData.summary.present ?? 0,
                    late: dashboardData.summary.late ?? 0,
                    absent: dashboardData.summary.absent ?? 0,
                    halfDay: dashboardData.summary['half-day'] ?? 0,
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div className="section-shell" variants={itemVariants}>
            <div className="section-shell__inner space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gradient-aurora">Recent Attendance</h3>
                <span className="text-xs sm:text-sm text-slate-400">Last 7 days</span>
              </div>
              <AttendanceTable records={dashboardData.recent ?? []} />
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}

function LegendPill({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-slate-900/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200">
      <span className={`h-2 w-2 rounded-full ${color} shadow-sm`} />
      {label}
    </span>
  )
}

function SummaryStat({ label, value, accent }) {
  return (
    <motion.div
      className="rounded-xl card-surface-muted p-3 hover:border-cyan-500/40 transition-colors"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <p className="text-xs uppercase tracking-wide text-slate-300">{label}</p>
      <motion.p
        className={`mt-1 text-xl font-semibold ${accent}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {value}
      </motion.p>
    </motion.div>
  )
}
