import clsx from 'clsx'
import GlassCard from '../common/GlassCard'

/**
 * Enhanced Stat Card with trends, percentages, and visual indicators
 */
export default function EnhancedStatCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  percentage,
  icon,
  neonColor = 'sky',
  size = 'medium',
  onClick
}) {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-5',
    large: 'p-6',
  }

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400'
    if (trend > 0) return 'text-emerald-400'
    if (trend < 0) return 'text-rose-400'
    return 'text-slate-400'
  }

  const getTrendIcon = () => {
    if (!trend || trend === 0) return '→'
    if (trend > 0) return '↑'
    return '↓'
  }

  return (
    <GlassCard 
      neonColor={neonColor} 
      className={sizeClasses[size]} 
      onClick={onClick}
      hover={Boolean(onClick)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {percentage !== undefined && (
              <span className="text-sm font-medium text-slate-400">
                ({percentage}%)
              </span>
            )}
          </div>
          
          {(subtitle || trend !== undefined) && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {subtitle && (
                <p className="text-xs text-slate-400">{subtitle}</p>
              )}
              {trend !== undefined && (
                <div className={clsx('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
                  <span className="text-base">{getTrendIcon()}</span>
                  <span>{Math.abs(trend)}%</span>
                  {trendLabel && <span className="text-slate-500">• {trendLabel}</span>}
                </div>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-lg">
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

/**
 * Score Card - Shows percentage score with circular progress
 */
export function ScoreCard({ title, score, maxScore = 100, neonColor = 'sky', description }) {
  const percentage = (score / maxScore) * 100
  const strokeDasharray = 2 * Math.PI * 40 // radius = 40
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  const getScoreColor = () => {
    if (percentage >= 90) return 'text-emerald-400'
    if (percentage >= 75) return 'text-sky-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-rose-400'
  }

  return (
    <GlassCard neonColor={neonColor} className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1">
          <p className={clsx('text-4xl font-bold', getScoreColor())}>
            {score}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            out of {maxScore}
          </p>
          {description && (
            <p className="mt-2 text-xs text-slate-500">{description}</p>
          )}
        </div>

        {/* Circular progress */}
        <div className="relative">
          <svg className="h-24 w-24 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-slate-800"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={clsx(
                'transition-all duration-1000',
                percentage >= 90 && 'text-emerald-500',
                percentage >= 75 && percentage < 90 && 'text-sky-500',
                percentage >= 60 && percentage < 75 && 'text-yellow-500',
                percentage < 60 && 'text-rose-500'
              )}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx('text-lg font-bold', getScoreColor())}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

/**
 * Comparison Card - Shows comparison between two metrics
 */
export function ComparisonCard({ 
  title, 
  primaryLabel, 
  primaryValue, 
  secondaryLabel, 
  secondaryValue,
  neonColor = 'purple'
}) {
  const total = primaryValue + secondaryValue
  const primaryPercentage = total > 0 ? (primaryValue / total) * 100 : 0
  const secondaryPercentage = total > 0 ? (secondaryValue / total) * 100 : 0

  return (
    <GlassCard neonColor={neonColor} className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      
      <div className="mt-4 space-y-4">
        {/* Primary metric */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{primaryLabel}</span>
            <span className="font-bold text-white">{primaryValue}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${primaryPercentage}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">{primaryPercentage.toFixed(1)}%</p>
        </div>

        {/* Secondary metric */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{secondaryLabel}</span>
            <span className="font-bold text-white">{secondaryValue}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
              style={{ width: `${secondaryPercentage}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">{secondaryPercentage.toFixed(1)}%</p>
        </div>
      </div>
    </GlassCard>
  )
}
