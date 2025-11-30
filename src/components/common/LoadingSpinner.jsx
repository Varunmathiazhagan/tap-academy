import { motion } from 'framer-motion'

/**
 * Loading Skeleton Component with shimmer effect
 */
export function LoadingSkeleton({ className, variant = 'default', lines = 1 }) {
  const variants = {
    default: 'h-4 bg-slate-800/60',
    text: 'h-4 bg-slate-800/60',
    title: 'h-6 bg-slate-800/60',
    button: 'h-10 bg-slate-800/60',
    avatar: 'h-12 w-12 bg-slate-800/60 rounded-full',
    card: 'h-32 bg-slate-800/60',
  }

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton rounded ${variants[variant]} ${className}`}
            style={{ width: `${100 - Math.random() * 30}%` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`skeleton rounded ${variants[variant]} ${className}`} />
  )
}

/**
 * Professional Dashboard Skeleton Loader
 */
export function DashboardSkeleton() {
  return (
    <motion.div 
      className="space-y-6 p-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Welcome Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent skeleton-shimmer" />
        <div className="flex items-center justify-between">
          <div className="space-y-4 flex-1">
            <div className="h-8 w-64 rounded-lg bg-slate-800/60 skeleton-pulse" />
            <div className="h-4 w-48 rounded bg-slate-800/40 skeleton-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="flex gap-3 mt-4">
              <div className="h-8 w-32 rounded-lg bg-slate-800/50 skeleton-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-8 w-24 rounded-lg bg-slate-800/50 skeleton-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
          <div className="h-20 w-20 rounded-2xl bg-slate-800/60 skeleton-pulse" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/5 to-transparent skeleton-shimmer" style={{ animationDelay: `${i * 0.15}s` }} />
            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-slate-800/50 skeleton-pulse" />
              <div className="h-10 w-20 rounded-lg bg-slate-800/60 skeleton-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="h-3 w-32 rounded bg-slate-800/40 skeleton-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Sections Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 rounded bg-slate-800/60 skeleton-pulse" />
              <div className="h-8 w-24 rounded-lg bg-slate-800/50 skeleton-pulse" />
            </div>
            <div className="h-48 w-full rounded-xl bg-slate-800/30 skeleton-pulse" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6">
          <div className="space-y-4">
            <div className="h-5 w-32 rounded bg-slate-800/60 skeleton-pulse" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 w-full rounded-xl bg-slate-800/40 skeleton-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Modern Loading Spinner with customizable colors
 */
export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className,
  text,
  label = 'Loading...',
  variant = 'spinner' // 'spinner' | 'dots' | 'pulse' | 'skeleton'
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    blue: 'text-blue-500',
    cyan: 'text-cyan-500',
    green: 'text-emerald-500',
    red: 'text-rose-500',
    purple: 'text-purple-500',
    gray: 'text-slate-400',
    white: 'text-white',
  }

  // Return skeleton variant
  if (variant === 'skeleton') {
    return <DashboardSkeleton />
  }

  // Legacy support for existing usage
  if (!text && label !== 'Loading...') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-cyan-500 border-r-transparent" />
        {label}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Professional spinner with glow effect */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Outer glow ring */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl`} />
        
        {/* Main spinner */}
        <motion.div
          className={`relative ${sizes[size]} ${colors[color]}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg
            className="w-full h-full drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      </motion.div>
      
      {(text || label) && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.p
            className="text-sm font-medium text-slate-300"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {text || label}
          </motion.p>
          <p className="text-xs text-slate-500 mt-1">Please wait...</p>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Pulse Loading Animation for buttons and cards
 */
export function PulseLoader({ className }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 200%'
      }}
    />
  )
}

/**
 * Loading Dots Animation
 */
export function LoadingDots({ className, color = 'gray' }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500',
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${colors[color]}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )
}

/**
 * Table Loading Skeleton
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <LoadingSkeleton key={i} variant="title" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} />
          ))}
        </div>
      ))}
    </div>
  )
}
