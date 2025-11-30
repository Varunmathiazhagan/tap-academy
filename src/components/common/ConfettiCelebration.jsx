import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

/**
 * Confetti Celebration Component
 * Triggers confetti animation for achievements like perfect attendance
 */
export default function ConfettiCelebration({ 
  trigger = false, 
  onComplete,
  type = 'default',
  message = 'Congratulations!' 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsVisible(true)
      
      // Fire confetti based on type
      switch (type) {
        case 'perfect-attendance':
          firePerfectAttendanceConfetti()
          break
        case 'achievement':
          fireAchievementConfetti()
          break
        case 'celebration':
          fireCelebrationConfetti()
          break
        default:
          fireDefaultConfetti()
      }

      // Auto hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [trigger, type, onComplete])

  const fireDefaultConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const firePerfectAttendanceConfetti = () => {
    // Green and gold theme for perfect attendance
    const colors = ['#10b981', '#f59e0b', '#84cc16', '#fbbf24']
    
    // Burst from center
    confetti({
      particleCount: 150,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    })
    
    confetti({
      particleCount: 150,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    })

    // Stars from top
    setTimeout(() => {
      confetti({
        particleCount: 50,
        shapes: ['star'],
        colors,
        origin: { y: 0.1 },
        gravity: 0.5,
        drift: 1
      })
    }, 300)
  }

  const fireAchievementConfetti = () => {
    // Blue and purple theme
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#a855f7']
    
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors
    })
  }

  const fireCelebrationConfetti = () => {
    // Rainbow theme
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']
    
    // Multiple bursts
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60 + i * 10,
          origin: { 
            x: Math.random(),
            y: Math.random() * 0.5 + 0.3 
          },
          colors
        })
      }, i * 200)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50"
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
            <div className="text-center space-y-4">
              {/* Achievement Icon */}
              <motion.div
                className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2
                }}
              >
                {type === 'perfect-attendance' ? (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </motion.div>

              {/* Message */}
              <motion.h2
                className="text-2xl font-bold text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.h2>

              {/* Sub-message based on type */}
              {type === 'perfect-attendance' && (
                <motion.p
                  className="text-green-600 font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  🎉 Perfect Attendance This Month! 🎉
                </motion.p>
              )}

              {/* Animated sparkles */}
              <div className="relative h-8">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-400"
                    style={{
                      left: `${20 + i * 10}%`,
                      top: Math.random() * 20
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Achievement Toast - smaller notification for minor achievements
 */
export function AchievementToast({ 
  visible, 
  title, 
  subtitle, 
  icon,
  onClose,
  duration = 4000 
}) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg border border-green-400/50">
            <div className="flex items-start gap-3">
              {icon && (
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  {icon}
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{title}</h4>
                {subtitle && (
                  <p className="text-green-100 text-xs mt-1">{subtitle}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}