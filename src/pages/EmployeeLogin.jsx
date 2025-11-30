import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBanner from '../components/common/ErrorBanner'
import { loginUser } from '../features/auth/authSlice'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function EmployeeLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, user } = useSelector((state) => state.auth)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (user?.role === 'employee') {
      navigate('/employee/dashboard')
    }
  }, [navigate, user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(loginUser(credentials))
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl"
          animate={{ 
            rotate: 360
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2 sm:gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-slate-300 backdrop-blur-sm transition-all hover:border-sky-500 hover:bg-slate-900/80 hover:text-sky-300 hover:shadow-lg hover:shadow-sky-500/10"
        >
          <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-[9px] sm:text-[11px] font-bold text-white shadow-lg shadow-sky-500/30 transition-transform group-hover:scale-110">
            TA
          </span>
          <span>Home</span>
          <svg className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-10">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="relative rounded-2xl sm:rounded-3xl border border-sky-500/20 bg-slate-950/80 p-5 sm:p-8 md:p-10 shadow-2xl shadow-sky-950/30 backdrop-blur-xl"
            variants={itemVariants}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-b from-sky-500/20 via-sky-500/5 to-transparent" />
            {/* Grid pattern overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            
            {/* Header Section */}
            <motion.div className="relative space-y-3 sm:space-y-4 text-center" variants={itemVariants}>
              <motion.div 
                className="mx-auto mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-xl shadow-sky-500/30"
                variants={floatingVariants}
                animate="animate"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg className="h-7 w-7 sm:h-9 sm:w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </motion.div>
              <motion.p 
                className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-sky-300"
                variants={itemVariants}
              >
                Employee Portal
              </motion.p>
              <motion.h1 
                className="text-xl xs:text-2xl sm:text-3xl font-bold text-white leading-tight"
                variants={itemVariants}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-[11px] xs:text-xs sm:text-sm text-slate-300 leading-relaxed"
                variants={itemVariants}
              >
                Sign in to track your attendance and view insights
              </motion.p>
            </motion.div>

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-4 sm:mt-6"
                >
                  <ErrorBanner message={error} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="relative mt-6 sm:mt-8 space-y-4 sm:space-y-5"
              variants={itemVariants}
            >
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Email Address
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-sky-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={credentials.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="liam.brooks@tapacademy.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-[13px] sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-sky-500 focus:bg-slate-800 focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="password" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Password
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-sky-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-[13px] sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-sky-500 focus:bg-slate-800 focus:ring-2 focus:ring-sky-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <motion.button
                type="submit"
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 sm:py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {status === 'loading' ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>

            {/* Demo Credentials */}
            <motion.div 
              className="relative mt-5 sm:mt-8 rounded-xl border border-sky-400/30 bg-sky-950/50 p-3 sm:p-4"
              variants={itemVariants}
            >
              <div className="mb-2 sm:mb-3 flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-sky-300">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo Credentials
              </div>
              <div className="grid gap-2 sm:gap-3 font-mono text-[10px] xs:text-[11px] sm:text-xs grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1 sm:space-y-1.5 rounded-lg bg-slate-900/60 p-2 sm:p-2.5 md:p-3">
                  <p className="text-slate-100 truncate"><span className="text-sky-400/80">Email:</span> liam.brooks@tapacademy.com</p>
                  <p className="text-slate-100"><span className="text-sky-400/80">Pass:</span> Password123!</p>
                </div>
                <div className="space-y-1 sm:space-y-1.5 rounded-lg bg-slate-900/60 p-2 sm:p-2.5 md:p-3">
                  <p className="text-slate-100 truncate"><span className="text-sky-400/80">Email:</span> elena.rossi@tapacademy.com</p>
                  <p className="text-slate-100"><span className="text-sky-400/80">Pass:</span> Password123!</p>
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            <motion.div 
              className="relative mt-5 sm:mt-8 space-y-3 sm:space-y-4 border-t border-slate-700/50 pt-4 sm:pt-6"
              variants={itemVariants}
            >
              <p className="text-center text-[11px] sm:text-xs text-slate-300">
                Don't have an account?{' '}
                <Link to="/employee/register" className="font-semibold text-sky-300 transition-colors hover:text-sky-200 hover:underline">
                  Register now
                </Link>
              </p>
              <p className="text-center text-[11px] sm:text-xs text-slate-400">
                Manager?{' '}
                <Link to="/manager/login" className="font-medium text-sky-300 transition-colors hover:text-sky-200 hover:underline">
                  Access Manager Portal
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
