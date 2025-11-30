import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ProtectedRoute({ roles }) {
  const { user, token, status } = useSelector((state) => state.auth)
  const location = useLocation()

  if (token && !user && status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Verifying session..." />
      </div>
    )
  }

  if (!token || !user) {
    const loginPath = location.pathname.startsWith('/manager') ? '/manager/login' : '/employee/login'
    return <Navigate to={loginPath} replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
