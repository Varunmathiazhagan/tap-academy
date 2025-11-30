import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

/**
 * Enhanced StatCard with animations and modern design
 */
export default function StatCard({ 
  title, 
  value, 
  description,
  tone = 'default', 
  icon,
  trend,
  trendType = 'positive',
  className,
  delay = 0,
  animateValue = true,
  suffix = '',
  prefix = '',
  loading = false
}) {
  const [displayValue, setDisplayValue] = useState(animateValue ? 0 : value)
  const [isVisible, setIsVisible] = useState(false)

  const toneConfig = {
    default: {
      bg: 'bg-slate-900/60 border-slate-800',
      text: 'text-white',
      accent: 'text-slate-400',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-emerald-700',
      text: 'text-emerald-100',
      accent: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    warning: {
      bg: 'bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border-amber-700',
      text: 'text-amber-100',
      accent: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
    },
    danger: {
      bg: 'bg-gradient-to-br from-rose-900/40 to-red-900/40 border-rose-700',
      text: 'text-rose-100',
      accent: 'text-rose-400',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
    },
    dark: {
      bg: 'bg-slate-900/60 border-slate-800',
      text: 'text-slate-100',
      accent: 'text-slate-400',
      iconBg: 'bg-slate-800',
      iconColor: 'text-slate-300',
    }
  }

  const config = toneConfig[tone] ?? toneConfig.default

  // Animate counter when value changes
  useEffect(() => {
    if (loading || !animateValue) return

    const timer = setTimeout(() => {
      setIsVisible(true)
      if (typeof value === 'number') {
        const increment = value / 30
        let current = 0
        const counter = setInterval(() => {
          current += increment
          if (current >= value) {
            setDisplayValue(value)
            clearInterval(counter)
          } else {
            setDisplayValue(Math.floor(current))
          }
        }, 30)
        return () => clearInterval(counter)
      } else {
        setDisplayValue(value)
      }
    }, delay * 100)

    return () => clearTimeout(timer)
  }, [value, delay, animateValue, loading])

  if (loading) {
    return (
      <div className={clsx('rounded-2xl border px-6 py-4 shadow-lg', config.bg, className)}>
        <div className="flex items-start justify-between">
          <div className="skeleton h-4 w-20 rounded mb-3"></div>
          <div className="skeleton h-6 w-6 rounded"></div>
        </div>
        <div className="skeleton h-8 w-16 rounded mb-2"></div>
        <div className="skeleton h-3 w-24 rounded"></div>
      </div>
    )
  }

  return (
    <motion.div
      className={clsx(
        'group rounded-2xl border px-6 py-4 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl relative overflow-hidden',
        config.bg,
        className
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ y: -3, scale: 1.02 }}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <motion.p 
            className={clsx("text-xs font-semibold uppercase tracking-wider", config.accent)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: delay * 0.1 }}
          >
            {title}
          </motion.p>
          {icon && (
            <motion.span 
              className={clsx("p-2 rounded-lg", config.iconBg, config.iconColor)}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: isVisible ? 1 : 0, rotate: isVisible ? 0 : -180 }}
              transition={{ delay: delay * 0.1 + 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {icon}
            </motion.span>
          )}
        </div>
        
        <motion.p 
          className={clsx("mt-3 text-3xl font-bold", config.text)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: delay * 0.1 + 0.3, type: "spring", stiffness: 200 }}
        >
          {prefix}{typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}{suffix}
        </motion.p>
        
        {(description || trend) && (
          <motion.div 
            className="mt-2 flex items-center justify-between"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: isVisible ? 0 : 10, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: delay * 0.1 + 0.4 }}
          >
            {description && (
              <p className={clsx("text-xs", config.accent)}>{description}</p>
            )}
            
            {trend && (
              <div className={clsx(
                'flex items-center text-xs font-medium ml-auto',
                trendType === 'positive' ? 'text-green-400' : 'text-red-400'
              )}>
                <svg
                  className={clsx(
                    'mr-1 h-3 w-3 transition-transform group-hover:scale-110',
                    trendType === 'positive' ? 'rotate-0' : 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17l5-5 5 5M7 7l5 5 5-5"
                  />
                </svg>
                {trend}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Mini Stat Card for compact spaces
 */
export function MiniStatCard({ title, value, icon, className, tone = 'default' }) {
  const config = {
    default: 'bg-slate-900/60 border-slate-800 text-white',
    success: 'bg-green-900/40 border-green-700 text-green-100',
    warning: 'bg-yellow-900/40 border-yellow-700 text-yellow-100',
    danger: 'bg-red-900/40 border-red-700 text-red-100',
  }

  return (
    <motion.div
      className={clsx(
        'flex items-center gap-3 p-4 rounded-lg border shadow-sm hover:shadow-md transition-all',
        config[tone] || config.default,
        className
      )}
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {icon && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </motion.div>
  )
}
