import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ErrorBanner from '../components/common/ErrorBanner'
import { registerUser } from '../features/auth/authSlice'

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto w-full max-w-5xl pb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300 transition hover:border-emerald-500 hover:text-emerald-300"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white">
            TA
          </span>
          Home
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm md:p-12">
        <div className="space-y-3 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">Employee Onboarding</p>
          <h1 className="text-3xl font-bold text-white">Join TAP Academy</h1>
          <p className="text-sm text-slate-400">Create your account and start tracking your attendance journey</p>
        </div>

        {error ? <ErrorBanner message={error} /> : null}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-200">
              Full Name *
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                value={formState.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-200">
              Work Email *
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@company.com"
                value={formState.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-200">
              Password *
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Min. 8 characters"
                value={formState.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <p className="text-xs text-slate-500">Must be at least 8 characters</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="employeeId" className="text-sm font-semibold text-slate-200">
              Employee ID *
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <input
                id="employeeId"
                name="employeeId"
                required
                placeholder="EMP001"
                value={formState.employeeId}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm uppercase text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="department" className="text-sm font-semibold text-slate-200">
              Department *
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <select
                id="department"
                name="department"
                required
                value={formState.department}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
              <svg className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status === 'loading'}
            >
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
            </button>
          </div>
        </form>

        <div className="space-y-3 border-t border-slate-800 pt-6">
          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/employee/login" className="font-semibold text-emerald-400 transition hover:text-emerald-300">
              Sign in instead
            </Link>
          </p>
          <p className="text-center text-xs text-slate-500">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
