import { motion } from 'framer-motion'
import { useState } from 'react'
import clsx from 'clsx'

/**
 * Modern Glass Card with hover animations
 * Perfect for dashboard widgets and content containers
 */
export default function ModernCard({
  children,
  className,
  hover = true,
  glass = false,
  padding = 'default',
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false)

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <motion.div
      className={clsx(
        'rounded-xl border transition-all duration-300 relative',
        glass 
          ? 'glass glass-hover border-white/20' 
          : 'bg-slate-900/60 border-slate-800 shadow-card text-white',
        hover && 'card-lift hover:shadow-card-hover',
        paddings[padding],
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
      
      {/* Subtle hover glow effect */}
      {hover && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

/**
 * Stat Card with animated counter and icons
 */
export function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  loading = false,
  className,
}) {
  return (
    <ModernCard className={clsx('relative overflow-hidden', className)}>
      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-8 w-16 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header with icon */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>
            {icon && (
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <div className="w-5 h-5 text-blue-400">{icon}</div>
              </div>
            )}
          </div>

          {/* Animated value */}
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>

          {/* Change indicator */}
          {change && (
            <motion.div
              className={clsx(
                'flex items-center text-sm',
                changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              )}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg
                className={clsx(
                  'w-4 h-4 mr-1',
                  changeType === 'positive' ? 'rotate-0' : 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
              </svg>
              {change}
            </motion.div>
          )}
        </div>
      )}
    </ModernCard>
  )
}

/**
 * Feature Card with hover effects
 */
export function FeatureCard({
  title,
  description,
  icon,
  onClick,
  className,
}) {
  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'group cursor-pointer',
        onClick && 'hover:cursor-pointer',
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <ModernCard className="h-full group-hover:shadow-xl transition-all duration-300">
        <div className="text-center space-y-4">
          {icon && (
            <motion.div
              className="mx-auto w-12 h-12 p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              {icon}
            </motion.div>
          )}
          
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-slate-400 text-sm">
            {description}
          </p>
        </div>
      </ModernCard>
    </motion.div>
  )
}

/**
 * Notification Card with slide-in animation
 */
export function NotificationCard({
  type = 'info',
  title,
  message,
  onClose,
  actions,
  className,
}) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <motion.div
      className={clsx(
        'border rounded-lg p-4',
        typeStyles[type],
        className
      )}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
          
          {actions && (
            <div className="mt-3 flex gap-2">
              {actions}
            </div>
          )}
        </div>
        
        {onClose && (
          <motion.button
            onClick={onClose}
            className="ml-auto flex-shrink-0 p-1 hover:bg-black/5 rounded"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}