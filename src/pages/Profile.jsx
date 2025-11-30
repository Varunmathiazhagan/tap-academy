import { useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'

const links = [
  { to: '/employee/dashboard', label: 'Dashboard' },
  { to: '/employee/mark-attendance', label: 'Mark Attendance' },
  { to: '/employee/history', label: 'My Attendance' },
  { to: '/employee/profile', label: 'Profile' },
]

export default function Profile() {
  const { user } = useSelector((state) => state.auth)

  return (
    <DashboardLayout title="My Profile" links={links}>
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="section-shell">
          <div className="section-shell__inner">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 shadow-xl shadow-cyan-500/30 text-3xl sm:text-4xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gradient-aurora">Account Details</h2>
                <p className="text-sm text-slate-400 mt-1">Manage your profile information</p>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl card-surface-muted p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Full Name</p>
                <p className="mt-2 text-base sm:text-lg text-white font-semibold">{user?.name}</p>
              </div>
              <div className="rounded-xl card-surface-muted p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Email</p>
                <p className="mt-2 text-base sm:text-lg text-white font-semibold break-all">{user?.email}</p>
              </div>
              <div className="rounded-xl card-surface-muted p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Employee ID</p>
                <p className="mt-2 text-base sm:text-lg text-white font-semibold">{user?.employeeId}</p>
              </div>
              <div className="rounded-xl card-surface-muted p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Department</p>
                <p className="mt-2 text-base sm:text-lg text-white font-semibold">{user?.department}</p>
              </div>
              <div className="rounded-xl card-surface-muted p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Role</p>
                <p className="mt-2 text-base sm:text-lg text-white font-semibold capitalize">{user?.role}</p>
              </div>
              <div className="rounded-xl card-surface-muted p-4">
                <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Member Since</p>
                <p className="mt-2 text-base sm:text-lg text-white font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-shell">
          <div className="section-shell__inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gradient-aurora">Security</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 mb-4">Contact your manager or administrator to update profile or reset password.</p>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex items-start gap-3 text-slate-300">
                <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                <span>Passwords must be at least 8 characters and include numbers.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                <span>Use your official employee email to ensure approvals.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                <span>Sign out when using a shared or public computer.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
