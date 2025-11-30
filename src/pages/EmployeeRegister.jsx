import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBanner from '../components/common/ErrorBanner'
import { registerUser } from '../features/auth/authSlice'

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

export default function EmployeeRegister() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, user } = useSelector((state) => state.auth)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
  })
  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user?.role === 'employee') {
      navigate('/employee/dashboard')
    }
  }, [navigate, user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(registerUser(formState))
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-600/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl"
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
          className="group inline-flex items-center gap-2 sm:gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-slate-300 backdrop-blur-sm transition-all hover:border-emerald-500 hover:bg-slate-900/80 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[9px] sm:text-[11px] font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
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
          className="w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="relative rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-slate-950/80 p-5 sm:p-8 md:p-10 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl"
            variants={itemVariants}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent" />
            {/* Grid pattern overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            
            {/* Header Section */}
            <motion.div className="relative space-y-3 sm:space-y-4 text-center" variants={itemVariants}>
              <motion.div 
                className="mx-auto mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30"
                variants={floatingVariants}
                animate="animate"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <svg className="h-7 w-7 sm:h-9 sm:w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </motion.div>
              <motion.p 
                className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-emerald-300"
                variants={itemVariants}
              >
                Employee Onboarding
              </motion.p>
              <motion.h1 
                className="text-xl xs:text-2xl sm:text-3xl font-bold text-white leading-tight"
                variants={itemVariants}
              >
                Join TAP Academy
              </motion.h1>
              <motion.p 
                className="text-[11px] xs:text-xs sm:text-sm text-slate-300 leading-relaxed"
                variants={itemVariants}
              >
                Create your account and start tracking your attendance journey
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
              className="relative mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2"
              variants={itemVariants}
            >
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="name" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Full Name *
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'name' ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formState.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-[13px] sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Work Email *
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-[13px] sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="password" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Password *
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={formState.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-[13px] sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30"
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
                <p className="text-[10px] sm:text-xs text-slate-500">Must be at least 8 characters</p>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="employeeId" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Employee ID *
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'employeeId' ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <input
                    id="employeeId"
                    name="employeeId"
                    required
                    placeholder="EMP001"
                    value={formState.employeeId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('employeeId')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-[13px] sm:text-sm uppercase text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                <label htmlFor="department" className="block text-[11px] xs:text-xs sm:text-sm font-semibold text-slate-100">
                  Department *
                </label>
                <div className="relative">
                  <svg className={`absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors ${focusedField === 'department' ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formState.department}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('department')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 text-[13px] sm:text-sm text-white outline-none transition-all focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="">Select your department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 sm:right-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <motion.button
                  type="submit"
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 sm:py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Create Account
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.form>

            {/* Footer Links */}
            <motion.div 
              className="relative mt-5 sm:mt-8 space-y-3 sm:space-y-4 border-t border-slate-700/50 pt-4 sm:pt-6"
              variants={itemVariants}
            >
              <p className="text-center text-[11px] sm:text-xs text-slate-300">
                Already have an account?{' '}
                <Link to="/employee/login" className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200 hover:underline">
                  Sign in instead
                </Link>
              </p>
              <p className="text-center text-[10px] sm:text-xs text-slate-400">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
