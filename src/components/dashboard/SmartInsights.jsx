import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import GlassCard, { GlassPanel } from '../common/GlassCard'

/**
 * Smart Insights Component - AI-powered attendance insights
 */
export default function SmartInsights() {
  const { employee } = useSelector((state) => state.dashboard)
  const dashboardData = employee?.data

  if (!dashboardData) return null

  const insights = generateInsights(dashboardData)

  return (
    <GlassPanel
      title="Smart Insights"
      subtitle="AI-powered attendance analysis"
      neonColor="cyan"
      headerGradient={false}
      titleTone="solid"
      icon={
        <svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      }
    >
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            {...insight}
            delay={index * 0.1}
          />
        ))}
      </div>
    </GlassPanel>
  )
}

/**
 * Smart Recommendations Component
 */
export function SmartRecommendations() {
  const { employee } = useSelector((state) => state.dashboard)
  const dashboardData = employee?.data

  if (!dashboardData) return null

  const recommendations = generateRecommendations(dashboardData)

  return (
    <GlassPanel
      title="Recommendations"
      subtitle="Personalized tips to improve"
      neonColor="cyan"
      headerGradient={false}
      titleTone="solid"
      icon={
        <svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
    >
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={index}
            {...rec}
            delay={index * 0.1}
          />
        ))}
      </div>
    </GlassPanel>
  )
}

/**
 * Individual Insight Card
 */
function InsightCard({ type, icon, title, description, metric, delay = 0 }) {
  const typeColors = {
    success: {
      accent: 'from-emerald-500/25 via-emerald-500/5 to-transparent',
      border: 'border-emerald-400/30',
      icon: 'text-emerald-300',
      pill: 'bg-emerald-500/10 ring-emerald-300/40 text-emerald-100',
    },
    warning: {
      accent: 'from-amber-400/25 via-amber-400/5 to-transparent',
      border: 'border-amber-400/30',
      icon: 'text-amber-300',
      pill: 'bg-amber-400/10 ring-amber-300/40 text-amber-100',
    },
    info: {
      accent: 'from-sky-400/25 via-sky-400/5 to-transparent',
      border: 'border-sky-400/30',
      icon: 'text-sky-300',
      pill: 'bg-sky-400/10 ring-sky-300/40 text-sky-100',
    },
    danger: {
      accent: 'from-rose-500/25 via-rose-500/5 to-transparent',
      border: 'border-rose-500/30',
      icon: 'text-rose-300',
      pill: 'bg-rose-500/10 ring-rose-400/40 text-rose-100',
    },
  }

  const colors = typeColors[type] || typeColors.info

  return (
    <motion.div
      className={clsx(
        'relative rounded-2xl p-5 card-surface-muted overflow-hidden transition-colors duration-500',
        colors.border
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(6,182,212,0.4)' }}
    >
      <div className={clsx('absolute inset-0 bg-gradient-to-r opacity-70 pointer-events-none', colors.accent)} />
      <div className="relative flex items-start gap-3">
        <div className={clsx('flex-shrink-0 mt-0.5 text-xl', colors.icon)}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-gradient-aurora">{title}</h4>
          <p className="mt-1 text-sm text-slate-300/90">{description}</p>
          {metric && (
            <div className={clsx('mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset backdrop-blur', colors.pill)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {metric}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Individual Recommendation Card
 */
function RecommendationCard({ icon, title, description, action, delay = 0 }) {
  return (
    <motion.div
      className="relative rounded-2xl card-surface-muted border border-slate-800/70 bg-gradient-to-r from-slate-900/70 to-slate-950/70 p-5 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0 text-cyan-300 mt-0.5 text-xl">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gradient-aurora text-lg">{title}</h4>
          <p className="mt-1 text-sm text-slate-300/90">{description}</p>
          {action && (
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:text-cyan-100 transition-colors"
            >
              {action}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Generate insights based on attendance data
 */
function generateInsights(data) {
  const insights = []
  const summary = data.summary || {}
  const recent = data.recent || []

  // Calculate attendance rate
  const totalDays = summary.present + summary.late + summary['half-day'] + summary.absent
  const attendanceRate = totalDays > 0 ? Math.round(((summary.present + summary.late) / totalDays) * 100) : 0

  // Perfect attendance insight
  if (summary.absent === 0 && totalDays >= 5) {
    insights.push({
      type: 'success',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Perfect Attendance!',
      description: 'You haven\'t missed a single day this month. Keep up the excellent work!',
      metric: '100% Present'
    })
  }

  // Late arrival pattern
  if (summary.late > 2) {
    insights.push({
      type: 'warning',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Late Arrival Pattern Detected',
      description: `You've been late ${summary.late} times this month. Consider adjusting your morning routine.`,
      metric: `${summary.late} late days`
    })
  }

  // Attendance streak
  let currentStreak = 0
  for (let i = 0; i < recent.length; i++) {
    if (recent[i].status === 'present' || recent[i].status === 'late') {
      currentStreak++
    } else {
      break
    }
  }

  if (currentStreak >= 5) {
    insights.push({
      type: 'success',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      title: 'Great Attendance Streak!',
      description: `You've maintained consistent attendance for ${currentStreak} consecutive days.`,
      metric: `${currentStreak} day streak`
    })
  }

  // Attendance improvement
  if (attendanceRate >= 90) {
    insights.push({
      type: 'success',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      title: 'Outstanding Performance',
      description: `Your attendance rate of ${attendanceRate}% is excellent. You're in the top performers!`,
      metric: `${attendanceRate}% rate`
    })
  } else if (attendanceRate < 75) {
    insights.push({
      type: 'danger',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      title: 'Attendance Needs Improvement',
      description: `Your current rate is ${attendanceRate}%. Let's work on improving this together.`,
      metric: `${attendanceRate}% rate`
    })
  }

  // Default insights if none generated
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Keep Track of Your Progress',
      description: 'Continue marking your attendance daily to get personalized insights.',
      metric: `${totalDays} days tracked`
    })
  }

  return insights
}

/**
 * Generate recommendations based on attendance patterns
 */
function generateRecommendations(data) {
  const recommendations = []
  const summary = data.summary || {}

  // Late arrival recommendation
  if (summary.late > 2) {
    recommendations.push({
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Set Earlier Alarms',
      description: 'Try waking up 30 minutes earlier to avoid late arrivals. Consider preparing the night before.',
      action: 'View Tips'
    })
  }

  // Absence recommendation
  if (summary.absent > 1) {
    recommendations.push({
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      title: 'Plan Ahead',
      description: 'Schedule time-off requests in advance to maintain better attendance records.',
      action: 'Request Leave'
    })
  }

  // Consistency recommendation
  if (summary.present >= 15) {
    recommendations.push({
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
      title: 'Maintain Your Momentum',
      description: 'You\'re doing great! Keep up this consistent attendance to achieve your goals.',
      action: 'View Goals'
    })
  }

  // Health recommendation
  recommendations.push({
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    title: 'Take Care of Yourself',
    description: 'Remember to maintain work-life balance. Regular breaks and self-care improve attendance.',
    action: 'Learn More'
  })

  return recommendations
}

