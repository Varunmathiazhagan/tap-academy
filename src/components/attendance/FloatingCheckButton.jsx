import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import confetti from 'canvas-confetti'

/**
 * Animated Circular Check-In/Out Button
 * Features: Green/Red glow, pulse animation, success popup
 */
export default function FloatingCheckButton({ 
  type = 'in', // 'in' or 'out'
  onClick, 
  disabled = false,
  loading = false,
  alreadyCompleted = false
}) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const isCheckIn = type === 'in'
  
  const handleClick = async () => {
    if (disabled || loading || alreadyCompleted) return
    
    setIsAnimating(true)
    
    try {
      await onClick()
      
      // Fire confetti on successful check-in/out
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: isCheckIn ? ['#10b981', '#34d399'] : ['#f59e0b', '#fbbf24']
      })
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Check action failed:', error)
    } finally {
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const baseClasses = isCheckIn
    ? 'from-emerald-500 to-teal-600 shadow-emerald-500/50 hover:shadow-emerald-500/70'
    : 'from-rose-500 to-pink-600 shadow-rose-500/50 hover:shadow-rose-500/70'

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading || alreadyCompleted}
        className={clsx(
          'group relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br text-white shadow-2xl transition-all duration-300',
          baseClasses,
          (disabled || loading || alreadyCompleted) && 'cursor-not-allowed opacity-50'
        )}
        whileHover={!disabled && !loading && !alreadyCompleted ? { scale: 1.1 } : {}}
        whileTap={!disabled && !loading && !alreadyCompleted ? { scale: 0.95 } : {}}
        animate={!disabled && !loading && !alreadyCompleted ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            '0 35px 60px -12px rgba(0, 0, 0, 0.4)',
            '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          ]
        } : {}}
        transition={{
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Outer glow ring */}
        <div className={clsx(
          'absolute inset-0 rounded-full blur-xl transition-all duration-300',
          isCheckIn ? 'bg-emerald-500/30' : 'bg-rose-500/30',
          !disabled && !alreadyCompleted && 'group-hover:bg-opacity-50 group-hover:blur-2xl'
        )} />

        {/* Inner content */}
        <div className="relative z-10 flex flex-col items-center">
          {loading ? (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          ) : alreadyCompleted ? (
            <>
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="mt-2 text-xs font-bold uppercase tracking-wider">
                {isCheckIn ? 'Checked In' : 'Checked Out'}
              </span>
            </>
          ) : (
            <>
              <svg 
                className={clsx(
                  'h-12 w-12 transition-transform duration-300',
                  !disabled && 'group-hover:scale-110'
                )} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isCheckIn ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                )}
              </svg>
              <span className="mt-2 text-sm font-bold uppercase tracking-wider">
                {isCheckIn ? 'Check In' : 'Check Out'}
              </span>
            </>
          )}
        </div>

        {/* Enhanced ripple effect on click */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white/30"
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Enhanced Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-8 shadow-2xl backdrop-blur-xl"
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.1, 1],
                y: 0,
                opacity: 1
              }}
              exit={{ 
                scale: 0.8,
                y: -50,
                opacity: 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/50"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 2
                  }}
                >
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <motion.h3
                    className="text-2xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isCheckIn ? 'Checked In Successfully!' : 'Checked Out Successfully!'}
                  </motion.h3>
                  <motion.p
                    className="mt-2 text-sm text-emerald-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles for custom animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 0.6s cubic-bezier(0.4, 0, 0.6, 1);
        }
      `}</style>
    </>
  )
}

/**
 * Dual Floating Buttons - Check In + Check Out side by side
 */
export function DualFloatingButtons({ 
  onCheckIn, 
  onCheckOut, 
  hasCheckedIn, 
  hasCheckedOut,
  loading 
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <FloatingCheckButton
        type="in"
        onClick={onCheckIn}
        disabled={hasCheckedIn}
        loading={loading}
        alreadyCompleted={hasCheckedIn}
      />
      <FloatingCheckButton
        type="out"
        onClick={onCheckOut}
        disabled={!hasCheckedIn || hasCheckedOut}
        loading={loading}
        alreadyCompleted={hasCheckedOut}
      />
    </div>
  )
}
