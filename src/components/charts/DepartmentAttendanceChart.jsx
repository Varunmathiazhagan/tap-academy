import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts'

export default function DepartmentAttendanceChart({ data = [] }) {
  if (!data.length) {
    return <p className="text-sm text-slate-400">No department data available.</p>
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b' }} />
          <Legend />
          <Bar dataKey="present" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          <Bar dataKey="late" fill="#facc15" radius={[8, 8, 0, 0]} />
          <Bar dataKey="absent" fill="#f87171" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
