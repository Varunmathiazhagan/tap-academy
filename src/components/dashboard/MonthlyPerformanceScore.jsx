import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { 
  selectAttendanceScore, 
  selectPerformanceBreakdown 
} from '../../features/performance/performanceSlice'

/**
 * Monthly Performance Score Component
 * Displays a circular percentage chart with color-coded progress
 * and performance breakdown. Connected to Redux for state management.
 */
export default function MonthlyPerformanceScore({ 
  maxScore = 100,
  className 
}) {
  // Get score and breakdown from Redux
  const score = useSelector(selectAttendanceScore)
  const breakdown = useSelector(selectPerformanceBreakdown)
  const percentage = Math.min(100, Math.round((score / maxScore) * 100))
  
  // Calculate stroke properties for circular progress
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * percentage) / 100

  // Determine color based on score
  const getScoreColor = () => {
    if (percentage >= 95) return 'emerald'
    if (percentage >= 85) return 'sky'
    if (percentage >= 75) return 'yellow'
    if (percentage >= 60) return 'orange'
    return 'rose'
  }

  const scoreColor = getScoreColor()

  const colorClasses = {
    emerald: {
      stroke: 'stroke-emerald-500',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/50',
      bg: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/30',
      ring: 'ring-emerald-500/20',
    },
    sky: {
      stroke: 'stroke-sky-500',
      text: 'text-sky-400',
      glow: 'shadow-sky-500/50',
      bg: 'from-sky-500/20 to-sky-500/5',
      border: 'border-sky-500/30',
      ring: 'ring-sky-500/20',
    },
    yellow: {
      stroke: 'stroke-yellow-500',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/50',
      bg: 'from-yellow-500/20 to-yellow-500/5',
      border: 'border-yellow-500/30',
      ring: 'ring-yellow-500/20',
    },
    orange: {
      stroke: 'stroke-orange-500',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/50',
      bg: 'from-orange-500/20 to-orange-500/5',
      border: 'border-orange-500/30',
      ring: 'ring-orange-500/20',
    },
    rose: {
      stroke: 'stroke-rose-500',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/50',
      bg: 'from-rose-500/20 to-rose-500/5',
      border: 'border-rose-500/30',
      ring: 'ring-rose-500/20',
    },
  }

  const colors = colorClasses[scoreColor]

  // Performance message
  const getPerformanceMessage = () => {
    if (percentage >= 95) return { emoji: '🌟', text: 'Outstanding Performance!', subtext: 'You\'re crushing it!' }
    if (percentage >= 85) return { emoji: '🎯', text: 'Excellent Work!', subtext: 'Keep up the great work!' }
    if (percentage >= 75) return { emoji: '👍', text: 'Good Progress', subtext: 'You\'re doing well!' }
    if (percentage >= 60) return { emoji: '📈', text: 'Room for Improvement', subtext: 'Let\'s get better!' }
    return { emoji: '🚨', text: 'Needs Attention', subtext: 'Let\'s turn this around!' }
  }

  const message = getPerformanceMessage()

  return (
    <motion.div
      className={clsx(
        'rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 shadow-xl backdrop-blur-sm',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Monthly Performance
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gradient-aurora">Attendance Score</h3>
        </div>
        <span className={clsx(
          'rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider backdrop-blur-xl shadow-lg ring-1',
          `bg-gradient-to-r ${colors.bg} border ${colors.border} ${colors.text} ${colors.ring}`
        )}>
          {percentage >= 95 ? '🌟 Perfect!' : percentage >= 85 ? '🎯 Excellent' : percentage >= 75 ? '👍 Good' : percentage >= 60 ? '📈 Fair' : '🚨 Poor'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Circular Progress Chart */}
        <div className="relative flex-shrink-0">
          <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-800"
            />
            
            {/* Progress circle with animation */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className={clsx(colors.stroke, 'drop-shadow-lg filter')}
              style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            {/* Inner glow circle */}
            <circle
              cx="80"
              cy="80"
              r={radius - 18}
              fill="currentColor"
              className={clsx(colors.text, 'opacity-5')}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={clsx('text-5xl font-bold', colors.text)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {percentage}
            </motion.span>
            <span className="text-lg text-slate-400">%</span>
            <span className="mt-1 text-xs text-slate-500">Score</span>
          </div>
        </div>

        {/* Performance Details */}
        <div className="flex-1 w-full space-y-6">
          {/* Message */}
          <div className={clsx(
            'rounded-xl border p-4 backdrop-blur-sm',
            `bg-gradient-to-r ${colors.bg} ${colors.border}`
          )}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{message.emoji}</span>
              <div>
                <h4 className={clsx('text-lg font-bold', colors.text)}>{message.text}</h4>
                <p className="text-sm text-slate-400">{message.subtext}</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Performance Breakdown
            </p>
            
            {breakdown.present !== undefined && (
              <BreakdownItem
                label="On-Time Days"
                value={breakdown.present || 0}
                total={breakdown.total || 1}
                color="emerald"
              />
            )}
            
            {breakdown.late !== undefined && (
              <BreakdownItem
                label="Late Arrivals"
                value={breakdown.late || 0}
                total={breakdown.total || 1}
                color="yellow"
              />
            )}
            
            {breakdown.halfDay !== undefined && breakdown.halfDay > 0 && (
              <BreakdownItem
                label="Half Days"
                value={breakdown.halfDay || 0}
                total={breakdown.total || 1}
                color="orange"
              />
            )}
            
            {breakdown.absent !== undefined && breakdown.absent > 0 && (
              <BreakdownItem
                label="Absences"
                value={breakdown.absent || 0}
                total={breakdown.total || 1}
                color="rose"
              />
            )}
          </div>

          {/* Score calculation info */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">💡 Score Calculation:</p>
            <p className="mt-1">
              Present days contribute 100%, Late 80%, Half-day 50%, Absent 0%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BreakdownItem({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  const colorClasses = {
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    rose: 'bg-rose-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-300">{label}</span>
        <span className="font-bold text-white">
          {value} <span className="text-slate-500 font-normal">/ {total}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className={clsx('h-full rounded-full', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{percentage}% of total days</p>
    </div>
  )
}
