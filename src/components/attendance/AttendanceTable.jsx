import StatusBadge from '../common/StatusBadge'

export default function AttendanceTable({ records = [] }) {
  if (!records.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
          <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-300">No attendance records to display</p>
        <p className="mt-1 text-xs text-slate-500">Records will appear here once attendance is marked</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-gradient-to-r from-slate-900 to-slate-800/80">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Check In</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Check Out</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Hours</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 bg-slate-900/20">
          {records.map((record) => (
            <tr key={record._id ?? record.date} className="transition hover:bg-slate-800/40">
              <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-200">
                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-slate-300">
                {record.checkInTime ? (
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-slate-300">
                {record.checkOutTime ? (
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </td>
              <td className="px-4 py-4"><StatusBadge status={record.status} /></td>
              <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-200">
                {record.totalHours?.toFixed ? record.totalHours.toFixed(2) : record.totalHours ?? '0.00'} hrs
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
