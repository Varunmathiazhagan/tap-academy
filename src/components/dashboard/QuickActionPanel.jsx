import { useState } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import clsx from 'clsx'
import { GlassPanel } from '../common/GlassCard'
import FloatingCheckButton from '../attendance/FloatingCheckButton'

/**
 * Quick Action Panel - Smart check-in, leave requests, weekly progress
 */
export default function QuickActionPanel({
  onCheckIn,
  onCheckOut,
  hasCheckedIn,
  hasCheckedOut,
  loading,
  weeklyData = [],
  onLeaveRequest
}) {
  const [showLeaveForm, setShowLeaveForm] = useState(false)

  return (
    <GlassPanel
      title="Quick Actions"
      subtitle="Manage your daily attendance"
      neonColor="cyan"
      headerGradient={false}
      titleTone="solid"
      icon={
        <svg className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
    >
      <div className="space-y-6">
        {/* Smart Check-In Button */}
        <div className="flex justify-center">
          <FloatingCheckButton
            type={hasCheckedIn ? 'out' : 'in'}
            onClick={hasCheckedIn ? onCheckOut : onCheckIn}
            disabled={hasCheckedOut}
            loading={loading}
            alreadyCompleted={hasCheckedIn && hasCheckedOut}
          />
        </div>

        {/* Weekly Progress Bar */}
        <WeeklyProgressBar data={weeklyData} />

        {/* Action Buttons */}
        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => {
              if (onLeaveRequest) {
                onLeaveRequest()
                return
              }
              setShowLeaveForm(true)
            }}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/30 p-4 text-left transition hover:border-purple-400/40 hover:bg-slate-900/60"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <svg className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Request Leave</p>
              <p className="text-xs text-slate-400">Submit time-off request</p>
            </div>
            <svg className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/30 p-4 text-left transition hover:border-sky-400/40 hover:bg-slate-900/60"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
              <svg className="h-5 w-5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">View Reports</p>
              <p className="text-xs text-slate-400">Monthly attendance summary</p>
            </div>
            <svg className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Leave Request Modal (placeholder) */}
      {showLeaveForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setShowLeaveForm(false)}>
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white">Request Leave</h3>
            <p className="mt-2 text-sm text-slate-400">This feature is coming soon!</p>
            <button
              type="button"
              onClick={() => setShowLeaveForm(false)}
              className="mt-4 w-full rounded-xl bg-purple-500 px-4 py-2 font-semibold text-white transition hover:bg-purple-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GlassPanel>
  )
}

/**
 * Weekly Progress Bar Component
 */
function WeeklyProgressBar({ data = [] }) {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const getStatusForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = data.find((d) => d.date.startsWith(dateStr))
    return record?.status
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500 border-emerald-400'
      case 'late':
        return 'bg-yellow-500 border-yellow-400'
      case 'half-day':
        return 'bg-orange-500 border-orange-400'
      case 'absent':
        return 'bg-rose-500 border-rose-400'
      default:
        return 'bg-slate-700 border-slate-600'
    }
  }

  const presentDays = data.filter((d) => d.status === 'present').length
  const weekProgress = (presentDays / 7) * 100

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-100">This Week's Progress</p>
        <span className="text-xs font-semibold text-cyan-200">{presentDays}/7 days</span>
      </div>

      {/* Day indicators */}
      <div className="mb-3 grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const status = getStatusForDay(day)
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

          return (
            <div key={index} className="text-center">
              <div className={clsx(
                'mx-auto h-10 w-10 rounded-lg border-2 transition-all',
                getStatusColor(status),
                isToday && 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900',
                !status && 'opacity-40'
              )}>
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-white">
                    {format(day, 'EEE')[0]}
                  </span>
                  <span className="text-xs text-white/90">{format(day, 'd')}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{ width: `${weekProgress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {weekProgress.toFixed(0)}% attendance this week
      </p>
    </div>
  )
}
