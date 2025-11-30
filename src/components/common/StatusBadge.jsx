import clsx from 'clsx'

const toneMap = {
  present: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
  absent: 'bg-rose-500/10 text-rose-200 border-rose-500/30',
  late: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30',
  'half-day': 'bg-orange-500/10 text-orange-200 border-orange-500/30',
  holiday: 'bg-purple-500/10 text-purple-200 border-purple-500/30',
  default: 'bg-slate-800 text-slate-300 border-slate-700',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        'rounded-full border px-3 py-1 text-xs font-semibold capitalize',
        toneMap[status] ?? toneMap.default,
      )}
    >
      {status?.replace('-', ' ') || 'unknown'}
    </span>
  )
}
