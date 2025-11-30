import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

export default function AttendanceTrendChart({ data = [] }) {
  if (!data.length) {
    return <p className="text-sm text-slate-400">No data for the selected range.</p>
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b' }} />
          <Area type="monotone" dataKey="present" stroke="#38bdf8" fillOpacity={1} fill="url(#present)" />
          <Area type="monotone" dataKey="late" stroke="#facc15" fillOpacity={0.3} fill="#facc15" />
          <Area type="monotone" dataKey="absent" stroke="#f87171" fillOpacity={0.2} fill="#f87171" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
