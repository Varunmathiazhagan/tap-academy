import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ErrorBanner from '../components/common/ErrorBanner'
import { loginUser } from '../features/auth/authSlice'

export default function ManagerLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error, user } = useSelector((state) => state.auth)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user?.role === 'manager') {
      navigate('/manager/dashboard')
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
          className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300 transition hover:border-purple-500 hover:text-purple-300"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-[11px] font-bold text-white">
            TA
          </span>
          Home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center pb-10">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm md:p-10">
        <div className="space-y-3 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
            <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">Manager Console</p>
          <h1 className="text-3xl font-bold text-white">Team Dashboard Access</h1>
          <p className="text-sm text-slate-400">Monitor team attendance, analyze trends, and generate insights</p>
        </div>

        {error ? <ErrorBanner message={error} /> : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-200">
              Manager Email
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="amelia.grant@tapacademy.com"
                value={credentials.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-200">
              Password
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <input
                id="password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition hover:from-purple-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo Credentials
          </div>
          <div className="space-y-1 font-mono text-xs text-slate-300">
            <p><span className="text-slate-500">Email:</span> amelia.grant@tapacademy.com</p>
            <p><span className="text-slate-500">Alt:</span> darius.cole@tapacademy.com</p>
            <p><span className="text-slate-500">Pass:</span> Password123!</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-800 pt-6">
          <p className="text-center text-xs text-slate-400">
            Need employee access?{' '}
            <Link to="/employee/login" className="font-semibold text-purple-400 transition hover:text-purple-300">
              Employee Login
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure manager authentication
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
