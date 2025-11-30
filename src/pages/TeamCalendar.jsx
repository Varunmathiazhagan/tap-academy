import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import MonthlyCalendar from '../components/attendance/MonthlyCalendar'
import TeamBirdsEyeCalendar from '../components/attendance/TeamBirdsEyeCalendar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import { fetchTeamRecords, resetFilters, fetchEmployeeDetails } from '../features/manager/managerSlice'
import { formatISTDate, formatISTTime } from '../utils/helpers'

const links = [
  { to: '/manager/dashboard', label: 'Dashboard' },
  { to: '/manager/attendance', label: 'All Attendance' },
  { to: '/manager/calendar', label: 'Team Calendar' },
  { to: '/manager/reports', label: 'Reports' },
]

export default function TeamCalendar() {
  const dispatch = useDispatch()
  const { records, selectedEmployee, status, employeeStatus } = useSelector((state) => state.manager)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [viewMode, setViewMode] = useState('individual') // 'individual' or 'team'

  useEffect(() => {
    dispatch(resetFilters())
    dispatch(fetchTeamRecords({}))
  }, [dispatch])

  const employees = useMemo(() => {
    const map = new Map()
    records.forEach((record) => {
      map.set(record.user._id, record.user)
    })
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [records])

  useEffect(() => {
    if (!selectedEmployeeId && employees.length) {
      const first = employees[0]
      setSelectedEmployeeId(first._id)
      dispatch(fetchEmployeeDetails(first._id))
    }
  }, [dispatch, employees, selectedEmployeeId])

  const handleEmployeeChange = (event) => {
    setSelectedEmployeeId(event.target.value)
    dispatch(fetchEmployeeDetails(event.target.value))
  }

  const monthDate = new Date(`${selectedMonth}-01`)
  const monthRecords = useMemo(() => {
    if (!selectedEmployee?.records) return []
    return selectedEmployee.records.filter((record) => record.date && record.date.startsWith(selectedMonth))
  }, [selectedEmployee, selectedMonth])

  return (
    <DashboardLayout title="Team Calendar View" links={links}>
      <div className="space-y-6">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('individual')}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition ${
              viewMode === 'individual'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Individual View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('team')}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition ${
              viewMode === 'team'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Team Overview
          </button>
        </div>

        {viewMode === 'team' ? (
          /* Team Bird's Eye View */
          <TeamBirdsEyeCalendar 
            teamRecords={records} 
            employees={employees} 
            monthDate={monthDate}
          />
        ) : (
          /* Individual Employee View */
          <>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Select Employee</label>
              <select
                value={selectedEmployeeId}
                onChange={handleEmployeeChange}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              >
                <option value="" disabled>
                  Choose employee
                </option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} • {employee.employeeId}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Legend</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-200">Present</span>
                <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-rose-200">Absent</span>
                <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-1 text-yellow-200">Late</span>
                <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2 py-1 text-orange-200">Half Day</span>
              </div>
            </div>
          </div>
        </div>

        {status === 'loading' || employeeStatus === 'loading' ? <LoadingSpinner label="Loading calendar..." /> : null}

        {selectedEmployee ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-white">{selectedEmployee.employee.name}</h3>
              <p className="text-sm text-slate-400">
                {selectedEmployee.employee.employeeId} • {selectedEmployee.employee.department}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Present</p>
                  <p className="text-base text-white">{monthRecords.filter((record) => record.status === 'present').length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Late</p>
                  <p className="text-base text-white">{monthRecords.filter((record) => record.status === 'late').length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Absent</p>
                  <p className="text-base text-white">{monthRecords.filter((record) => record.status === 'absent').length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Half Day</p>
                  <p className="text-base text-white">{monthRecords.filter((record) => record.status === 'half-day').length}</p>
                </div>
              </div>
            </div>

            <MonthlyCalendar monthDate={monthDate} records={monthRecords} />

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-white">Daily Details</h3>
              <div className="mt-4 space-y-3">
                {monthRecords.length === 0 ? (
                  <p className="text-sm text-slate-400">No records captured for this month.</p>
                ) : (
                  monthRecords.map((record) => (
                    <div key={record._id} className="flex flex-wrap items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                      <div>
                        <p className="font-medium text-white">{formatISTDate(record.date)}</p>
                        <p className="text-xs text-slate-400">
                          In: {record.checkInTime ? formatISTTime(record.checkInTime) : '—'} • Out{' '}
                          {record.checkOutTime ? formatISTTime(record.checkOutTime) : '—'}
                        </p>
                      </div>
                      <StatusBadge status={record.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Select an employee to view calendar.</p>
        )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
