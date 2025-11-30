import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import attendanceReducer from '../features/attendance/attendanceSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import managerReducer from '../features/manager/managerSlice'
import insightsReducer from '../features/insights/insightsSlice'
import performanceReducer from '../features/performance/performanceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    dashboard: dashboardReducer,
    manager: managerReducer,
    insights: insightsReducer,
    performance: performanceReducer,
  },
})
