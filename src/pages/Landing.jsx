import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
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
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const featureCardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -right-60 -top-60 h-[40rem] w-[40rem] rounded-full bg-sky-500/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-60 -left-60 h-[40rem] w-[40rem] rounded-full bg-purple-600/5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      {/* Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-slate-950/50' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <Link to="/" className="group flex items-center gap-2 sm:gap-3 text-white">
              <motion.div 
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-5 w-5 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </motion.div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">Tap Academy</p>
                <p className="text-sm sm:text-base font-bold tracking-wide">Attendance Suite</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3">
              <Link
                to="/employee/login"
                className="group rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 lg:px-4 py-2 text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-sm transition-all hover:border-sky-500 hover:bg-sky-500/10 hover:text-sky-300 hover:shadow-lg hover:shadow-sky-500/10"
              >
                Employee Login
              </Link>
              <Link
                to="/manager/login"
                className="group rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 lg:px-4 py-2 text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-sm transition-all hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                Manager Login
              </Link>
              <Link
                to="/employee/register"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 lg:px-5 py-2 text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-sky-500/30 transition-all hover:shadow-lg hover:shadow-sky-500/40"
              >
                <span className="relative z-10">Employee Signup</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div 
            className={`md:hidden overflow-hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-4 space-y-2">
              <Link
                to="/employee/login"
                className="block rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200 text-center transition-all hover:border-sky-500 hover:text-sky-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Employee Login
              </Link>
              <Link
                to="/manager/login"
                className="block rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200 text-center transition-all hover:border-purple-500 hover:text-purple-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manager Login
              </Link>
              <Link
                to="/employee/register"
                className="block rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white text-center shadow-md shadow-sky-500/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Employee Signup
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
        <motion.div 
          className="mx-auto max-w-6xl space-y-12 sm:space-y-16 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div 
              className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-2xl shadow-sky-500/25"
              variants={floatingVariants}
              animate="animate"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <svg className="h-8 w-8 sm:h-11 sm:w-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </motion.div>
            
            <motion.div 
              className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-3 sm:px-4 py-1 sm:py-1.5"
              variants={itemVariants}
            >
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-sky-400">TAP Academy</p>
            </motion.div>
            
            <motion.h1 
              className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent leading-tight"
              variants={itemVariants}
            >
              Employee Attendance
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text">Made Simple</span>
            </motion.h1>
            
            <motion.p 
              className="mx-auto max-w-3xl text-sm sm:text-lg md:text-xl leading-relaxed text-slate-300 px-4"
              variants={itemVariants}
            >
              Seamlessly track daily attendance, monitor productivity, and generate actionable insights. 
              Employees check in effortlessly while managers gain real-time clarity across all departments.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            variants={itemVariants}
          >
            <Link
              to="/employee/login"
              className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-2xl shadow-sky-500/30 transition-all hover:shadow-sky-500/40"
            >
              <motion.span 
                className="relative z-10 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Employee Login
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              to="/manager/login"
              className="group w-full sm:w-auto overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-900/60 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800/80"
            >
              <motion.span 
                className="flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Manager Console
              </motion.span>
            </Link>
          </motion.div>

          {/* Test Credentials Card */}
          <motion.div 
            className="mx-auto max-w-4xl rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 p-4 sm:p-6 backdrop-blur-sm"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400">Test Credentials</h3>
            </div>
            <div className="grid gap-3 sm:gap-4 text-left md:grid-cols-2">
              <motion.div 
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4"
                whileHover={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}
              >
                <p className="mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">Manager Login</p>
                <div className="space-y-0.5 sm:space-y-1 font-mono text-[11px] sm:text-sm text-slate-200">
                  <p><span className="text-slate-500">Email:</span> amelia.grant@tapacademy.com</p>
                  <p><span className="text-slate-500">Alt:</span> darius.cole@tapacademy.com</p>
                  <p><span className="text-slate-500">Pass:</span> Password123!</p>
                </div>
              </motion.div>
              <motion.div 
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4"
                whileHover={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                <p className="mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">Employee Login</p>
                <div className="space-y-0.5 sm:space-y-1 font-mono text-[11px] sm:text-sm text-slate-200">
                  <p><span className="text-slate-500">Email:</span> liam.brooks@tapacademy.com</p>
                  <p><span className="text-slate-500">Alt:</span> elena.rossi@tapacademy.com</p>
                  <p><span className="text-slate-500">Pass:</span> Password123!</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4"
            variants={containerVariants}
          >
            {[
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Quick Check-In",
                description: "One-click daily check-in and check-out with automatic time tracking",
                gradient: "from-emerald-500/20 to-emerald-600/20",
                iconColor: "text-emerald-400",
                hoverBorder: "hover:border-emerald-500/50"
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Calendar View",
                description: "Visual calendar with color-coded status for easy monthly overview",
                gradient: "from-blue-500/20 to-blue-600/20",
                iconColor: "text-blue-400",
                hoverBorder: "hover:border-blue-500/50"
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Analytics Dashboard",
                description: "Real-time charts showing attendance trends and team performance",
                gradient: "from-purple-500/20 to-purple-600/20",
                iconColor: "text-purple-400",
                hoverBorder: "hover:border-purple-500/50"
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "CSV Export",
                description: "Download attendance reports for compliance and payroll processing",
                gradient: "from-amber-500/20 to-amber-600/20",
                iconColor: "text-amber-400",
                hoverBorder: "hover:border-amber-500/50"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-sm transition-all ${feature.hoverBorder} hover:bg-slate-900/60`}
                variants={featureCardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                custom={index}
              >
                <motion.div 
                  className={`mb-4 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.iconColor}`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-2 text-sm sm:text-base font-bold text-white">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid gap-4 sm:gap-6 sm:grid-cols-3 px-4"
            variants={containerVariants}
          >
            {[
              { value: "99.9%", label: "System Uptime", color: "text-sky-400" },
              { value: "Real-time", label: "Data Sync", color: "text-emerald-400" },
              { value: "Secure", label: "JWT Auth", color: "text-purple-400" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-5 sm:p-6 text-center backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.05, borderColor: 'rgba(56, 189, 248, 0.3)' }}
                custom={index}
              >
                <motion.div 
                  className={`mb-2 text-2xl sm:text-4xl font-black ${stat.color}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="border-t border-slate-800 pt-6 sm:pt-8 px-4"
            variants={itemVariants}
          >
            <p className="text-xs sm:text-sm text-slate-500">
              Built with React, Redux Toolkit, Node.js, Express & MongoDB
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
