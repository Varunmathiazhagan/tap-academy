import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Loading Skeleton Component with shimmer effect
 */
export function LoadingSkeleton({ className, variant = 'default', lines = 1 }) {
  const variants = {
    default: 'h-4 bg-gray-200',
    text: 'h-4 bg-gray-200',
    title: 'h-6 bg-gray-200',
    button: 'h-10 bg-gray-200',
    avatar: 'h-12 w-12 bg-gray-200 rounded-full',
    card: 'h-32 bg-gray-200',
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
 * Modern Loading Spinner with customizable colors
 */
export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className,
  text,
  label = 'Loading...'
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600',
    white: 'text-white',
  }

  // Legacy support for existing usage
  if (!text && label !== 'Loading...') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-500 border-r-transparent" />
        {label}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <motion.div
        className={`${sizes[size]} ${colors[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </motion.div>
      
      {(text || label) && (
        <motion.p
          className={`text-sm font-medium ${colors[color]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text || label}
        </motion.p>
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
