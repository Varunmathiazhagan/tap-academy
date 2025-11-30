import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import { fetchTeamRecords, setFilter, resetFilters } from '../features/manager/managerSlice'
import { formatISTDate, formatISTTime } from '../utils/helpers'

const links = [
  { to: '/manager/dashboard', label: 'Dashboard' },
  { to: '/manager/attendance', label: 'All Attendance' },
  { to: '/manager/calendar', label: 'Team Calendar' },
  { to: '/manager/reports', label: 'Reports' },
]

export default function TeamAttendance() {
  const dispatch = useDispatch()
  const { records, filters, status, error } = useSelector((state) => state.manager)

  useEffect(() => {
    dispatch(fetchTeamRecords(filters))
  }, [dispatch, filters])

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    dispatch(setFilter({ [name]: value }))
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <DashboardLayout title="Team Attendance" links={links}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Filter Attendance Records</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">Employee ID</label>
              <input
                name="employeeId"
                value={filters.employeeId}
                onChange={handleFilterChange}
                placeholder="e.g. EMP001"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm uppercase text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-slate-400">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="md:col-span-1 flex items-end gap-3">
              <button
                type="button"
                onClick={() => dispatch(fetchTeamRecords(filters))}
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
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>

        {status === 'loading' ? <LoadingSpinner label="Fetching team records..." /> : null}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-left uppercase text-xs text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Check In</th>
                <th className="px-4 py-3 font-medium">Check Out</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-400">
                    No records match the selected filters.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-200">
                      <div className="font-medium text-white">{record.user.name}</div>
                      <div className="text-xs text-slate-400">{record.user.employeeId}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{record.user.department}</td>
                    <td className="px-4 py-3 text-slate-300">{formatISTDate(record.date)}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.checkInTime ? formatISTTime(record.checkInTime) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.checkOutTime ? formatISTTime(record.checkOutTime) : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3 text-slate-300">{record.totalHours?.toFixed ? record.totalHours.toFixed(2) : record.totalHours ?? '0.00'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
