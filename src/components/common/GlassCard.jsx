import { motion } from 'framer-motion'
import { useState } from 'react'
import clsx from 'clsx'

/**
 * Neo Glassmorphism Card Component
 * Features: Advanced frosted glass effect, neon edges, floating depth
 */
export default function GlassCard({ 
  children, 
  className = '', 
  neonColor = 'sky', 
  intensity = 'medium',
  hover = true,
  floating = true,
  gradient = false,
  onClick = null 
}) {
  const [isHovered, setIsHovered] = useState(false)

  const intensityClasses = {
    light: 'bg-transparent backdrop-blur-lg border-slate-700/30',
    medium: 'bg-slate-900/40 backdrop-blur-xl border-slate-700/40',
    strong: 'bg-slate-900/50 backdrop-blur-2xl border-slate-700/50',
    ultra: 'bg-slate-950/60 backdrop-blur-3xl border-slate-700/60',
  }

  const neonColorClasses = {
    sky: 'border-sky-400/20 hover:border-sky-400/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.6)]',
    purple: 'border-purple-400/20 hover:border-purple-400/40 hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]',
    emerald: 'border-emerald-400/20 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(52,211,153,0.6)]',
    rose: 'border-rose-400/20 hover:border-rose-400/40 hover:shadow-[0_0_40px_rgba(244,63,94,0.6)]',
    amber: 'border-amber-400/20 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)]',
    orange: 'border-orange-400/20 hover:border-orange-400/40 hover:shadow-[0_0_40px_rgba(251,146,60,0.6)]',
    cyan: 'border-cyan-400/20 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]',
    pink: 'border-pink-400/20 hover:border-pink-400/40 hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]',
  }

  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl border shadow-2xl transition-all duration-500 overflow-hidden',
        intensityClasses[intensity],
        neonColorClasses[neonColor],
        floating && 'floating-hover',
        onClick && 'cursor-pointer',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hover ? (floating ? { y: -8, scale: 1.02 } : { scale: 1.02 }) : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
      )}

      {/* Animated border glow */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Inner content with relative positioning */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle floating particles effect */}
      {floating && isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

/**
 * Neo Glass Panel with Gradient Header
 */
export function GlassPanel({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  icon, 
  actions,
  neonColor = 'sky',
  headerGradient = true,
  titleTone = 'gradient'
}) {
  const titleClass = titleTone === 'gradient' ? 'text-gradient-neon' : 'text-white'

  return (
    <GlassCard 
      className={clsx('overflow-hidden', className)} 
      neonColor={neonColor}
      intensity="medium"
      floating={true}
    >
      {(title || icon) && (
        <motion.div 
          className={clsx(
            'p-4 sm:p-5 md:p-6 relative',
            headerGradient ? 'bg-gradient-to-r from-slate-800/40 via-slate-800/30 to-slate-900/40' : 'bg-transparent'
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {headerGradient && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
          )}
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              {icon && (
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-xl glass-morphism-light backdrop-blur-xl border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-white">{icon}</div>
                </motion.div>
              )}
              {title && (
                <div>
                  <h3 className={clsx('text-xl font-bold', titleClass)}>{title}</h3>
                  {subtitle && (
                    <p className="mt-1 text-sm text-white/70">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      <div className="p-4 sm:p-5 md:p-6">
        {children}
      </div>
    </GlassCard>
  )
}

/**
 * Neo Glass Stat Card with Advanced Effects
 */
export function GlassStatCard({ 
  title, 
  value, 
  description, 
  icon, 
  neonColor = 'sky', 
  trend,
  delay = 0 
}) {
  return (
    <GlassCard 
      neonColor={neonColor} 
      className="p-3 sm:p-4 md:p-5 relative overflow-hidden"
      intensity="light"
      gradient={false}
      floating={true}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <motion.p
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1 }}
          >
            {title}
          </motion.p>
          
          <motion.div
            className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay * 0.1 + 0.2, 
              type: "spring", 
              stiffness: 200 
            }}
          >
            {value}
          </motion.div>
          
          {description && (
            <motion.p
              className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
            >
              {description}
            </motion.p>
          )}
          
          {trend && (
            <motion.div
              className={clsx(
                'mt-3 inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-xl shadow-lg',
                trend > 0 ? 'text-emerald-200 bg-emerald-500/20 ring-1 ring-emerald-400/40' : 'text-rose-200 bg-rose-500/20 ring-1 ring-rose-400/40'
              )}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: delay * 0.1 + 0.4 }}
            >
              <svg 
                className={clsx('w-4 h-4', trend > 0 ? 'rotate-0' : 'rotate-180')}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
              </svg>
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>
        
        {icon && (
          <motion.div
            className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-800/60 border border-slate-700/50 flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: delay * 0.1 + 0.1, 
              type: "spring", 
              stiffness: 200 
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-lg sm:text-xl md:text-2xl">{icon}</span>
          </motion.div>
        )}
      </div>

    </GlassCard>
  )
}

/**
 * Glass Button with Neon Effects
 */
export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    if (disabled || loading) return

    // Create ripple effect
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = { id: Date.now(), x, y, size }
    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variants = {
    primary: 'glass-morphism-light text-white border-white/20',
    neon: `glass-morphism-light text-white border-white/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]`,
    gradient: 'gradient-bg-cyber text-white border-transparent',
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={clsx(
        'relative overflow-hidden rounded-xl font-medium transition-all duration-500 focus:outline-none backdrop-blur-xl border',
        sizes[size],
        variants[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:scale-105 floating-hover',
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </span>
    </motion.button>
  )
}
