import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Tap Academy</p>
            <p className="text-base font-bold tracking-wide">Attendance Suite</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/employee/login"
            className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
          >
            Employee Login
          </Link>
          <Link
            to="/manager/login"
            className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-purple-500 hover:text-purple-300"
          >
            Manager Login
          </Link>
          <Link
            to="/employee/register"
            className="hidden rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-sky-500/30 transition hover:from-sky-400 hover:to-blue-500 sm:inline-flex"
          >
            Employee Signup
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-16 text-center">
          {/* Header */}
          <div className="space-y-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-2xl shadow-sky-500/25">
              <svg className="h-11 w-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400">TAP Academy</p>
            </div>
            <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl md:text-7xl">
              Employee Attendance
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text">Made Simple</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Seamlessly track daily attendance, monitor productivity, and generate actionable insights. 
              Employees check in effortlessly while managers gain real-time clarity across all departments.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/employee/login"
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-sky-500/30 transition-all hover:scale-105 hover:shadow-sky-500/40 sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Employee Login
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              to="/manager/login"
              className="group w-full overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-slate-600 hover:bg-slate-800/80 sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Manager Console
              </span>
            </Link>
          </div>

          {/* Test Credentials Card */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-center gap-2">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Test Credentials</h3>
            </div>
            <div className="grid gap-4 text-left md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Manager Login</p>
                <div className="space-y-1 font-mono text-sm text-slate-200">
                  <p><span className="text-slate-500">Email:</span> amelia.grant@tapacademy.com</p>
                  <p><span className="text-slate-500">Alt:</span> darius.cole@tapacademy.com</p>
                  <p><span className="text-slate-500">Pass:</span> Password123!</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Employee Login</p>
                <div className="space-y-1 font-mono text-sm text-slate-200">
                  <p><span className="text-slate-500">Email:</span> liam.brooks@tapacademy.com</p>
                  <p><span className="text-slate-500">Alt:</span> elena.rossi@tapacademy.com</p>
                  <p><span className="text-slate-500">Pass:</span> Password123!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-sky-500/50 hover:bg-slate-900/60">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-white">Quick Check-In</h3>
              <p className="text-sm text-slate-400">One-click daily check-in and check-out with automatic time tracking</p>
            </div>
            
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-sky-500/50 hover:bg-slate-900/60">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-white">Calendar View</h3>
              <p className="text-sm text-slate-400">Visual calendar with color-coded status for easy monthly overview</p>
            </div>
            
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-sky-500/50 hover:bg-slate-900/60">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-white">Analytics Dashboard</h3>
              <p className="text-sm text-slate-400">Real-time charts showing attendance trends and team performance</p>
            </div>
            
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-sky-500/50 hover:bg-slate-900/60">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-bold text-white">CSV Export</h3>
              <p className="text-sm text-slate-400">Download attendance reports for compliance and payroll processing</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 text-center backdrop-blur-sm">
              <div className="mb-2 text-4xl font-black text-sky-400">99.9%</div>
              <div className="text-sm text-slate-400">System Uptime</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 text-center backdrop-blur-sm">
              <div className="mb-2 text-4xl font-black text-emerald-400">Real-time</div>
              <div className="text-sm text-slate-400">Data Sync</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 text-center backdrop-blur-sm">
              <div className="mb-2 text-4xl font-black text-purple-400">Secure</div>
              <div className="text-sm text-slate-400">JWT Auth</div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 pt-8">
            <p className="text-sm text-slate-500">
              Built with React, Redux Toolkit, Node.js, Express & MongoDB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
