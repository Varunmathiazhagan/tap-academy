import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { GlassPanel } from '../common/GlassCard'

/**
 * Hours Worked Bar Chart - Last 7 days
 */
export function HoursWorkedChart({ data = [] }) {
  return (
    <GlassPanel
      title="Hours Worked"
      subtitle="Last 7 days activity"
      icon={
        <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: 12,
                padding: 10
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar 
              dataKey="hours" 
              fill="url(#colorGradient)" 
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.7} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}

/**
 * Attendance Distribution Pie Chart
 */
export function AttendanceDistributionChart({ data = { present: 0, late: 0, absent: 0, halfDay: 0 } }) {
  const chartData = [
    { name: 'Present', value: data.present, color: '#10b981' },
    { name: 'Late', value: data.late, color: '#eab308' },
    { name: 'Half Day', value: data.halfDay, color: '#f97316' },
    { name: 'Absent', value: data.absent, color: '#ef4444' },
  ].filter(item => item.value > 0)

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <GlassPanel
      title="Attendance Distribution"
      subtitle="This month breakdown"
      icon={
        <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      }
    >
      <div className="flex flex-col items-center">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#0f172a', 
                  border: '1px solid #1e293b',
                  borderRadius: 12
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid w-full grid-cols-2 gap-3 text-sm">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300">{item.name}</span>
              <span className="ml-auto font-semibold text-white">
                {item.value} <span className="text-xs text-slate-500">({((item.value / total) * 100).toFixed(0)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  )
}

/**
 * Weekly Attendance Line Graph
 */
export function WeeklyAttendanceGraph({ data = [] }) {
  return (
    <GlassPanel
      title="Weekly Attendance Trend"
      subtitle="Team attendance over time"
      icon={
        <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: 12
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="present" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="late" 
              stroke="#eab308" 
              strokeWidth={3}
              dot={{ fill: '#eab308', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="absent" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}

/**
 * Department-wise Attendance Bar Graph
 */
export function DepartmentAttendanceGraph({ data = [] }) {
  return (
    <GlassPanel
      title="Department Performance"
      subtitle="Comparative attendance rates"
      icon={
        <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="department" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              label={{ value: 'Employees', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: 12
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" fill="#eab308" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}

/**
 * Late Arrivals Trend Graph
 */
export function LateArrivalsTrendGraph({ data = [] }) {
  return (
    <GlassPanel
      title="Late Arrivals Trend"
      subtitle="Tracking punctuality over time"
      icon={
        <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: 12
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#eab308" 
              strokeWidth={3}
              fill="url(#lateGradient)"
              dot={{ fill: '#eab308', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  )
}
