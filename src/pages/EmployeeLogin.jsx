import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ErrorBanner from '../components/common/ErrorBanner'
import { loginUser } from '../features/auth/authSlice'

export default function EmployeeLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, user } = useSelector((state) => state.auth)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="mx-auto w-full max-w-5xl pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-[11px] font-bold text-white">
            TA
          </span>
          Home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center pb-10">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm md:p-10">
        <div className="space-y-3 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25">
            <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">Employee Portal</p>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400">Sign in to track your attendance and view insights</p>
        </div>

        {error ? <ErrorBanner message={error} /> : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-200">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={credentials.email}
              onChange={handleChange}
              placeholder="liam.brooks@tapacademy.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={status === 'loading'}
          >
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
          </button>
        </form>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo Credentials
          </div>
          <div className="grid gap-2 font-mono text-xs text-slate-200 sm:grid-cols-2">
            <div className="space-y-1">
              <p><span className="text-slate-500">Email:</span> liam.brooks@tapacademy.com</p>
              <p><span className="text-slate-500">Pass:</span> Password123!</p>
            </div>
            <div className="space-y-1">
              <p><span className="text-slate-500">Email:</span> elena.rossi@tapacademy.com</p>
              <p><span className="text-slate-500">Pass:</span> Password123!</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-800 pt-6">
          <p className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/employee/register" className="font-semibold text-sky-400 hover:text-sky-300">
              Register now
            </Link>
          </p>
          <p className="text-center text-xs text-slate-500">
            Manager? <Link to="/manager/login" className="font-medium text-sky-400 hover:text-sky-300">Access Manager Portal</Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
