import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../features/auth/authSlice'

export default function DashboardLayout({ title, links, children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const role = user?.role
    await dispatch(logoutUser())
    navigate(role === 'manager' ? '/manager/login' : '/employee/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            <p className="text-xs text-slate-400">{user?.name} • {user?.role}</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="mt-4 flex flex-col gap-2 border-t border-slate-800 pt-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-medium transition ${isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 rounded-lg bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              Sign Out
            </button>
          </nav>
        )}
      </header>

      {/* Desktop Layout */}
      <div className="flex gap-6 px-4 py-4 md:px-6 md:py-8">
        {/* Sidebar */}
        <aside className="sticky top-8 hidden h-fit w-72 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm md:block">
          <div className="mb-8 border-b border-slate-800 pb-6">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">TAP Academy</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.employeeId} • {user?.department}</p>
          </div>
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`
                }
              >
                <span className="flex items-center gap-2">
                  {link.label}
                </span>
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6 pb-20 md:pb-8">
          <header className="hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/60 to-slate-900/40 px-6 py-5 shadow-xl backdrop-blur-sm md:block">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">{title}</h2>
                <p className="mt-1 text-sm text-slate-400">{user?.department} Department</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.employeeId}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            </div>
          </header>
          <section>{children}</section>
        </main>
      </div>
    </div>
  )
}
