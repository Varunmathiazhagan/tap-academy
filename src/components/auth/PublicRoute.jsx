import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'

export default function PublicRoute() {
  const { user, token, status } = useSelector((state) => state.auth)

  if (token && !user && status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner label="Preparing your dashboard..." />
      </div>
    )
  }

  if (user && token) {
    return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} replace />
  }

  return <Outlet />
}
