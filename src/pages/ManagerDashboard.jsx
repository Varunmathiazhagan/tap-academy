import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoadingSpinner, { DashboardSkeleton } from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import EnhancedStatCard, { ComparisonCard } from '../components/dashboard/EnhancedStatCard'
import AIAlerts from '../components/dashboard/AIAlerts'
import { WeeklyAttendanceGraph, DepartmentAttendanceGraph, LateArrivalsTrendGraph } from '../components/dashboard/AdvancedCharts'
import AttendanceTrendChart from '../components/charts/AttendanceTrendChart'
import { loadManagerDashboard } from '../features/dashboard/dashboardSlice'
import { fetchTodayStatus } from '../features/manager/managerSlice'
import RealTimePresenceMap from '../components/dashboard/RealTimePresenceMap'
import { formatISTTime } from '../utils/helpers'

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

const links = [
  { to: '/manager/dashboard', label: 'Dashboard' },
  { to: '/manager/attendance', label: 'All Attendance' },
  { to: '/manager/calendar', label: 'Team Calendar' },
  { to: '/manager/reports', label: 'Reports' },
]

export default function ManagerDashboard() {
  const dispatch = useDispatch()
  const { manager } = useSelector((state) => state.dashboard)
  const { today } = useSelector((state) => state.manager)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(loadManagerDashboard()),
        dispatch(fetchTodayStatus())
      ])
      setInitialLoading(false)
    }
    loadData()
  }, [dispatch])

  const data = manager.data

  // Calculate advanced metrics
  const analytics = useMemo(() => {
    if (!data || !today) return {}

    const allRecords = today || []
    const employees = Array.from(new Set(allRecords.map(r => r.user)))
    const departments = Array.from(new Set(employees.map(e => e.department)))

    // Find weakest department
    const deptStats = departments.map(dept => {
      const deptEmployees = employees.filter(e => e.department === dept)
      const deptRecords = allRecords.filter(r => deptEmployees.some(e => e._id === r.user._id))
      const presentCount = deptRecords.filter(r => r.status === 'present' || r.status === 'late').length
      const rate = deptEmployees.length > 0 ? (presentCount / deptEmployees.length) * 100 : 0
      return { dept, rate }
    })
    const weakest = deptStats.sort((a, b) => a.rate - b.rate)[0]

    // Early leaves
    const earlyLeaves = allRecords.filter(r => {
      if (!r.checkOutTime) return false
      const checkOutHour = new Date(r.checkOutTime).getHours()
      return checkOutHour < 17 // Before 5 PM
    }).length

    return {
      employees,
      departments,
      weakestDept: weakest?.dept || 'N/A',
      weakestRate: weakest?.rate.toFixed(0) || 0,
      earlyLeaves,
    }
  }, [data, today])

  // Show skeleton during initial load
  if (initialLoading) {
    return (
      <DashboardLayout title="Manager Dashboard" links={links}>
        <DashboardSkeleton />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Manager Dashboard" links={links}>
      {/* Loading indicator for refresh */}
      <AnimatePresence mode="wait">
        {manager.status === 'loading' && !initialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner label="Aggregating stats..." />
          </motion.div>
        )}
      </AnimatePresence>

      {data ? (
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top KPI Cards */}
          <motion.div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 section-shell p-4" variants={itemVariants}>
            <EnhancedStatCard
              title="Total Employees"
              value={data.totalEmployees}
              subtitle="Team members"
              neonColor="sky"
              icon={
                <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <EnhancedStatCard
              title="Present Today"
              value={data.today.present}
              percentage={data.totalEmployees > 0 ? ((data.today.present / data.totalEmployees) * 100).toFixed(0) : 0}
              subtitle="Checked in"
              trend={3}
              trendLabel="vs yesterday"
              neonColor="emerald"
              icon={
                <svg className="h-6 w-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
            />
            <EnhancedStatCard
              title="Late Today"
              value={data.today.late.length}
              percentage={data.totalEmployees > 0 ? ((data.today.late.length / data.totalEmployees) * 100).toFixed(0) : 0}
              subtitle="Running late"
              trend={-1}
              trendLabel="improvement"
              neonColor="amber"
              icon={
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <EnhancedStatCard
              title="Early Leaves"
              value={analytics.earlyLeaves || 0}
              subtitle="Left before 5 PM"
              neonColor="orange"
              icon={
                <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            />
            <ComparisonCard
              title="Weakest Department"
              primaryLabel={analytics.weakestDept || 'N/A'}
              primaryValue={parseInt(analytics.weakestRate) || 0}
              secondaryLabel="Average"
              secondaryValue={85}
              neonColor="rose"
            />
          </motion.div>

          {/* AI Alerts */}
          <motion.div variants={itemVariants}>
            <AIAlerts 
              attendanceData={today || []} 
              employees={analytics.employees || []} 
              departments={analytics.departments || []}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RealTimePresenceMap records={today || []} />
          </motion.div>

          {/* Charts Grid */}
          <motion.div className="grid gap-6 grid-cols-1 lg:grid-cols-2" variants={itemVariants}>
            <WeeklyAttendanceGraph data={data.weeklyTrend || []} />
            <DepartmentAttendanceGraph data={data.departmentStats || []} />
          </motion.div>

          <motion.div className="grid gap-6 grid-cols-1 lg:grid-cols-2" variants={itemVariants}>
            <LateArrivalsTrendGraph 
              data={data.weeklyTrend?.map(day => ({
                date: day.date,
                count: day.late || 0
              })) || []}
            />
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">Monthly Heatmap</h3>
              <p className="text-sm text-slate-400">Department performance overview</p>
              <div className="mt-4">
                <AttendanceTrendChart data={data.weeklyTrend || []} />
              </div>
            </div>
          </motion.div>

          <motion.div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white">Late Arrivals Today</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {data.today.late.length === 0 ? (
                <p className="text-sm text-slate-400">No late arrivals reported yet.</p>
              ) : (
                data.today.late.map((employee) => (
                  <span key={employee.employeeId} className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                    {employee.name} • {employee.employeeId}
                  </span>
                ))
              )}
            </div>
          </motion.div>

          <motion.div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white">Absent Employees Today</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 grid-cols-1 sm:grid-cols-2">
              {data.absentEmployees.length === 0 ? (
                <p>Everyone has checked in today.</p>
              ) : (
                data.absentEmployees.map((employee) => (
                  <div key={employee.employeeId} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/80 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{employee.name}</p>
                      <p className="text-xs text-slate-400">{employee.employeeId} • {employee.department}</p>
                    </div>
                    <StatusBadge status="absent" />
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white">Live Check-ins</h3>
            <p className="text-sm text-slate-400">Employees who have checked in today</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 grid-cols-1 sm:grid-cols-2">
              {!today || today.length === 0 ? (
                <p>No check-ins recorded yet.</p>
              ) : (
                today.map((record) => (
                  <div key={record._id} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/80 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{record.user.name}</p>
                      <p className="text-xs text-slate-400">{record.user.employeeId} • {record.user.department}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>In: {record.checkInTime ? formatISTTime(record.checkInTime) : '—'}</p>
                      <StatusBadge status={record.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </DashboardLayout>
  )
}
