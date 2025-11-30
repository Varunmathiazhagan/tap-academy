import { useMemo } from 'react'
import clsx from 'clsx'
import GlassCard from '../common/GlassCard'

/**
 * AI Alerts Component - Intelligent pattern detection and notifications
 */
export default function AIAlerts({ attendanceData = [], employees = [], departments = [] }) {
  const alerts = useMemo(() => {
    const generatedAlerts = []

    // Analyze individual employee patterns
    employees.forEach((employee) => {
      const employeeRecords = attendanceData.filter((r) => r.user._id === employee._id)
      
      // Pattern: Late arrivals (7+ times this month)
      const lateCount = employeeRecords.filter((r) => r.status === 'late').length
      if (lateCount >= 7) {
        generatedAlerts.push({
          type: 'warning',
          severity: 'high',
          category: 'punctuality',
          title: `${employee.name} frequently late`,
          description: `Late ${lateCount} times this month`,
          icon: 'clock',
          employee: employee.name,
          department: employee.department,
          actionable: true,
          metric: lateCount,
        })
      }

      // Pattern: Declining attendance
      const recentRecords = employeeRecords.slice(-7)
      const absentCount = recentRecords.filter((r) => r.status === 'absent').length
      if (absentCount >= 3) {
        generatedAlerts.push({
          type: 'danger',
          severity: 'critical',
          category: 'attendance',
          title: `${employee.name} attendance concern`,
          description: `${absentCount} absences in last 7 days`,
          icon: 'alert',
          employee: employee.name,
          department: employee.department,
          actionable: true,
          metric: absentCount,
        })
      }

      // Pattern: Perfect attendance
      const presentCount = employeeRecords.filter((r) => r.status === 'present').length
      if (presentCount >= 25 && lateCount === 0) {
        generatedAlerts.push({
          type: 'success',
          severity: 'low',
          category: 'achievement',
          title: `${employee.name} perfect attendance`,
          description: `${presentCount} consecutive on-time days`,
          icon: 'trophy',
          employee: employee.name,
          department: employee.department,
          actionable: false,
          metric: presentCount,
        })
      }
    })

    // Analyze department patterns
    departments.forEach((dept) => {
      const deptEmployees = employees.filter((e) => e.department === dept)
      const deptRecords = attendanceData.filter((r) => deptEmployees.some((e) => e._id === r.user._id))
      
      if (deptRecords.length === 0) return

      const presentRate = (deptRecords.filter((r) => r.status === 'present').length / deptRecords.length) * 100
      
      // Pattern: Department below average (< 75%)
      if (presentRate < 75) {
        generatedAlerts.push({
          type: 'warning',
          severity: 'medium',
          category: 'department',
          title: `${dept} attendance below average`,
          description: `Only ${presentRate.toFixed(0)}% attendance rate`,
          icon: 'building',
          department: dept,
          actionable: true,
          metric: presentRate.toFixed(1),
        })
      }

      // Pattern: Department excellence (> 95%)
      if (presentRate > 95) {
        generatedAlerts.push({
          type: 'success',
          severity: 'low',
          category: 'achievement',
          title: `${dept} exemplary performance`,
          description: `${presentRate.toFixed(0)}% attendance rate`,
          icon: 'star',
          department: dept,
          actionable: false,
          metric: presentRate.toFixed(1),
        })
      }
    })

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return generatedAlerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  }, [attendanceData, employees, departments])

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical')
  const actionableAlerts = alerts.filter((a) => a.actionable)

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard neonColor="rose" className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical</p>
          <p className="mt-2 text-2xl font-bold text-rose-300">{criticalAlerts.length}</p>
        </GlassCard>
        <GlassCard neonColor="amber" className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Action Needed</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">{actionableAlerts.length}</p>
        </GlassCard>
        <GlassCard neonColor="emerald" className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Insights</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{alerts.length}</p>
        </GlassCard>
      </div>

      {/* Alert List */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">AI-Powered Insights</h3>
          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
            {alerts.length} alerts
          </span>
        </div>

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-slate-400">All clear! No alerts at this time.</p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Individual Alert Card
 */
function AlertCard({ alert }) {
  const getAlertStyles = () => {
    switch (alert.type) {
      case 'danger':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-rose-500/10',
          text: 'text-rose-300',
          icon: 'text-rose-400',
        }
      case 'warning':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-500/10',
          text: 'text-amber-300',
          icon: 'text-amber-400',
        }
      case 'success':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-300',
          icon: 'text-emerald-400',
        }
      default:
        return {
          border: 'border-sky-500/40',
          bg: 'bg-sky-500/10',
          text: 'text-sky-300',
          icon: 'text-sky-400',
        }
    }
  }

  const getIcon = () => {
    switch (alert.icon) {
      case 'clock':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        )
      case 'alert':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        )
      case 'trophy':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        )
      case 'building':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        )
      case 'star':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        )
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )
    }
  }

  const styles = getAlertStyles()

  return (
    <div className={clsx(
      'flex items-start gap-4 rounded-xl border p-4 transition-all hover:scale-[1.02]',
      styles.border,
      styles.bg
    )}>
      <div className="flex-shrink-0">
        <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', styles.bg)}>
          <svg className={clsx('h-6 w-6', styles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {getIcon()}
          </svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={clsx('font-semibold', styles.text)}>{alert.title}</p>
            <p className="mt-1 text-sm text-slate-400">{alert.description}</p>
          </div>
          
          {alert.metric && (
            <div className="flex-shrink-0 text-right">
              <p className={clsx('text-2xl font-bold', styles.text)}>{alert.metric}</p>
              <p className="text-xs text-slate-500">{alert.category}</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {alert.employee && (
            <span className="rounded-full bg-slate-800/50 px-2 py-1 text-slate-300">
              {alert.employee}
            </span>
          )}
          {alert.department && (
            <span className="rounded-full bg-slate-800/50 px-2 py-1 text-slate-300">
              {alert.department}
            </span>
          )}
          {alert.actionable && (
            <span className="ml-auto rounded-full bg-purple-500/20 px-2 py-1 font-semibold text-purple-300">
              Action Required
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
