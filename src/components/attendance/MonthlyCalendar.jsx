import { useState } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import clsx from 'clsx'
import StatusBadge from '../common/StatusBadge'
import { formatISTTime } from '../../utils/helpers'

const statusColors = {
  present: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/40 shadow-emerald-500/20',
  absent: 'bg-rose-500/10 text-rose-200 border-rose-500/40 shadow-rose-500/20',
  late: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/40 shadow-yellow-500/20',
  'half-day': 'bg-orange-500/10 text-orange-200 border-orange-500/40 shadow-orange-500/20',
}

function resolveStatus(date, records) {
  const isoDate = new Date(date).toISOString().slice(0, 10)
  const match = records.find((record) => record.date.slice(0, 10) === isoDate)
  return match?.status
}

function findRecord(date, records) {
  const isoDate = new Date(date).toISOString().slice(0, 10)
  return records.find((record) => record.date.slice(0, 10) === isoDate)
}

export default function MonthlyCalendar({ monthDate, records }) {
  const [selectedDay, setSelectedDay] = useState(null)
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const start = startOfWeek(monthStart, { weekStartsOn: 1 })
  const end = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-4 shadow-xl md:p-6">
      <div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span key={day} className="hidden md:inline">{day}</span>
        ))}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <span key={`${day}-${idx}`} className="md:hidden">{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-sm md:gap-2">
        {days.map((day) => {
          const status = resolveStatus(day, records)
          const record = findRecord(day, records)
          const isCurrentMonth = isSameMonth(day, monthStart)
          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => record && setSelectedDay({ date: day, record })}
              disabled={!record}
              className={clsx(
                'flex h-14 flex-col items-center justify-center rounded-xl border text-xs transition-all md:h-16',
                status ? `${statusColors[status]} shadow-lg` : 'border-slate-800 bg-slate-900/30 text-slate-300',
                !isCurrentMonth && 'opacity-40',
                isToday(day) && 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950',
                record && 'cursor-pointer hover:scale-105 hover:shadow-2xl',
                !record && 'cursor-default'
              )}
            >
              <span className="text-sm font-bold text-white md:text-base">{format(day, 'd')}</span>
              <span className="mt-0.5 hidden text-[9px] uppercase tracking-wider md:inline md:text-[10px]">
                {status ? status.replace('-', ' ') : '—'}
              </span>
            </button>
          )
        })}
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setSelectedDay(null)}>
          <div className="w-full max-w-md animate-in fade-in zoom-in rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Attendance Details</h3>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date</p>
                <p className="mt-1.5 text-lg font-bold text-white">{format(selectedDay.date, 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
                <div className="mt-2">
                  <StatusBadge status={selectedDay.record.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Check In</p>
                  <p className="mt-1.5 text-base font-medium text-white">
                    {selectedDay.record.checkInTime
                      ? formatISTTime(selectedDay.record.checkInTime)
                      : '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Check Out</p>
                  <p className="mt-1.5 text-base font-medium text-white">
                    {selectedDay.record.checkOutTime
                      ? formatISTTime(selectedDay.record.checkOutTime)
                      : '—'}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Hours</p>
                <p className="mt-1.5 text-lg font-bold text-white">
                  {selectedDay.record.totalHours ? `${selectedDay.record.totalHours.toFixed(2)} hours` : '0.00 hours'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-400 hover:to-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
