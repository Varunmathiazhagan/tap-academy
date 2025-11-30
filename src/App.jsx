import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import EmployeeLogin from './pages/EmployeeLogin'
import EmployeeRegister from './pages/EmployeeRegister'
import EmployeeDashboard from './pages/EmployeeDashboard'
import MarkAttendance from './pages/MarkAttendance'
import AttendanceHistory from './pages/AttendanceHistory'
import Profile from './pages/Profile'
import ManagerLogin from './pages/ManagerLogin'
import ManagerDashboard from './pages/ManagerDashboard'
import TeamAttendance from './pages/TeamAttendance'
import TeamCalendar from './pages/TeamCalendar'
import Reports from './pages/Reports'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import { fetchCurrentUser } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, token])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Navigate to="/employee/login" replace />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/register" element={<EmployeeRegister />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
      </Route>

      <Route element={<ProtectedRoute roles={['employee']} />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/mark-attendance" element={<MarkAttendance />} />
        <Route path="/employee/history" element={<AttendanceHistory />} />
        <Route path="/employee/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute roles={['manager']} />}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/attendance" element={<TeamAttendance />} />
        <Route path="/manager/calendar" element={<TeamCalendar />} />
        <Route path="/manager/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
