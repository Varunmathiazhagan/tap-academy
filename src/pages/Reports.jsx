import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import { fetchTeamRecords, fetchTeamSummary, setFilter, resetFilters, exportAttendanceCsv } from '../features/manager/managerSlice'
import { downloadBlob } from '../utils/helpers'

const links = [
  { to: '/manager/dashboard', label: 'Dashboard' },
  { to: '/manager/attendance', label: 'All Attendance' },
  { to: '/manager/calendar', label: 'Team Calendar' },
  { to: '/manager/reports', label: 'Reports' },
]

export default function Reports() {
  const dispatch = useDispatch()
  const { records, filters, status, summary, exportStatus } = useSelector((state) => state.manager)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const monthParam = `${new Date().toISOString().slice(0, 7)}-01`
    dispatch(fetchTeamRecords({}))
    dispatch(fetchTeamSummary({ month: monthParam }))
  }, [dispatch])

  const handleChange = (event) => {
    const { name, value } = event.target
    dispatch(setFilter({ [name]: value }))
  }

  const handleReset = () => {
    dispatch(resetFilters())
    const monthParam = `${new Date().toISOString().slice(0, 7)}-01`
    dispatch(fetchTeamRecords({}))
    dispatch(fetchTeamSummary({ month: monthParam }))
    setPage(1)
  }

  const handleApply = () => {
    const monthParam = filters.startDate
      ? `${filters.startDate.slice(0, 7)}-01`
      : `${new Date().toISOString().slice(0, 7)}-01`
    dispatch(fetchTeamRecords(filters))
    dispatch(fetchTeamSummary({ month: monthParam }))
    setPage(1)
  }

  const handleExport = () => {
    dispatch(exportAttendanceCsv(filters))
      .unwrap()
      .then((blob) => {
        const timestamp = new Date().toISOString().slice(0, 10)
        downloadBlob(blob, `attendance-report-${timestamp}.csv`)
      })
      .catch((error) => {
        console.error('Export failed:', error)
      })
  }

  // Pagination derived data
  const total = records.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const pageRecords = records.slice(startIndex, endIndex)

  return (
    <DashboardLayout title="Attendance Reports" links={links}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Generate Report</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">Employee ID</label>
              <input
                name="employeeId"
                value={filters.employeeId}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm uppercase text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              >
                <option value="">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-1 flex items-end gap-3">
              <button
                type="button"
                onClick={handleApply}
                className="w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={exportStatus === 'loading'}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {exportStatus === 'loading' ? 'Exporting...' : 'Export CSV'}
            </button>
            <p className="text-xs text-slate-400">Exports respect the filters above.</p>
          </div>
        </div>

        {summary ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            <h3 className="text-lg font-semibold text-white">Summary</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Present</p>
                <p className="text-base text-white">{summary.summary.present ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Late</p>
                <p className="text-base text-white">{summary.summary.late ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Absent</p>
                <p className="text-base text-white">{summary.summary.absent ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Half Day</p>
                <p className="text-base text-white">{summary.summary['half-day'] ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Team Size</p>
                <p className="text-base text-white">{summary.totalMembers}</p>
              </div>
            </div>
          </div>
        ) : null}

        {status === 'loading' ? <LoadingSpinner label="Building report..." /> : null}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-left uppercase text-xs text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Check In</th>
                <th className="px-4 py-3 font-medium">Check Out</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {pageRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-400">
                    No records available. Adjust filters and try again.
                  </td>
                </tr>
              ) : (
                pageRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-200">
                      <div className="font-medium text-white">{record.user.name}</div>
                      <div className="text-xs text-slate-400">{record.user.employeeId} • {record.user.department}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3 text-slate-300">{record.totalHours?.toFixed ? record.totalHours.toFixed(2) : record.totalHours ?? '0.00'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const size = Number(e.target.value)
                  setPageSize(size)
                  setPage(1)
                }}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span>
                {total === 0 ? '0–0 of 0' : `${startIndex + 1}–${Math.min(endIndex, total)} of ${total}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-white disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
