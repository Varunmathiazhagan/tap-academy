import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import MonthlyCalendar from '../components/attendance/MonthlyCalendar'
import AttendanceHeatmap from '../components/attendance/AttendanceHeatmap'
import AttendanceTable from '../components/attendance/AttendanceTable'
import LoadingSpinner from '../components/common/LoadingSpinner'
import GlassCard from '../components/common/GlassCard'
import { loadHistory, loadSummary } from '../features/attendance/attendanceSlice'

const links = [
  { to: '/employee/dashboard', label: 'Dashboard' },
  { to: '/employee/mark-attendance', label: 'Mark Attendance' },
  { to: '/employee/history', label: 'My Attendance' },
  { to: '/employee/profile', label: 'Profile' },
]

export default function AttendanceHistory() {
  const dispatch = useDispatch()
  const { history, summary, loading } = useSelector((state) => state.attendance)
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [viewMode, setViewMode] = useState('calendar') // 'calendar', 'table', or 'heatmap'
  const [statusFilter, setStatusFilter] = useState('') // '', 'present', 'absent', 'late', 'half-day'

  useEffect(() => {
    dispatch(loadHistory({ month: `${selectedMonth}-01` }))
    dispatch(loadSummary({ month: `${selectedMonth}-01` }))
  }, [dispatch, selectedMonth])

  const monthDate = new Date(`${selectedMonth}-01`)
  const filteredHistory = statusFilter
    ? history.filter((r) => r.status === statusFilter)
    : history

  return (
    <DashboardLayout title="My Attendance History" links={links}>
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header Controls */}
        <div className="section-shell">
          <div className="section-shell__inner">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 shadow-xl shadow-cyan-500/30">
                  <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gradient-aurora">Select Month</p>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="mt-1 rounded-lg border border-cyan-500/30 bg-slate-900/80 px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-2">
              {[
                { key: '', label: 'All', tone: 'bg-slate-800 text-slate-200 border-slate-700' },
                { key: 'present', label: 'Present', tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/40' },
                { key: 'late', label: 'Late', tone: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/40' },
                { key: 'absent', label: 'Absent', tone: 'bg-rose-500/10 text-rose-200 border-rose-500/40' },
                { key: 'half-day', label: 'Half-day', tone: 'bg-orange-500/10 text-orange-200 border-orange-500/40' },
              ].map((chip) => (
                <button
                  key={chip.key || 'all'}
                  type="button"
                  onClick={() => setStatusFilter(chip.key)}
                  className={`${chip.tone} rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === chip.key ? 'ring-1 ring-sky-400' : 'hover:bg-slate-800/60'
                  }`}
                >
                  {chip.label}
                </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 p-1">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  viewMode === 'calendar'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('heatmap')}
                className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  viewMode === 'heatmap'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Heatmap</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 mt-6">
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-3 sm:p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Present</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-emerald-200">{summary.present ?? 0}</p>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-600/5 p-3 sm:p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Absent</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-rose-200">{summary.absent ?? 0}</p>
              </div>
              <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-3 sm:p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Late</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-yellow-200">{summary.late ?? 0}</p>
              </div>
              <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-3 sm:p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Half Days</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-orange-200">{summary['half-day'] ?? 0}</p>
              </div>
              <div className="col-span-2 md:col-span-1 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 p-3 sm:p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Total Hours</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-cyan-200">{summary.totalHours ?? 0} <span className="text-sm">hrs</span></p>
              </div>
            </div>
          </div>
        </div>

        {loading ? <LoadingSpinner label="Fetching attendance..." /> : null}

        {/* View Toggle Content */}
        {viewMode === 'calendar' ? (
          <MonthlyCalendar monthDate={monthDate} records={filteredHistory} />
        ) : viewMode === 'heatmap' ? (
          <AttendanceHeatmap records={filteredHistory} year={new Date(selectedMonth).getFullYear()} />
        ) : (
          <div className="section-shell">
            <div className="section-shell__inner space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-bold text-gradient-aurora">Detailed Records</h3>
                <span className="text-xs sm:text-sm text-slate-400">{filteredHistory.length} records</span>
              </div>
              <AttendanceTable records={filteredHistory} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
