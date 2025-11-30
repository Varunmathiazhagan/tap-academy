import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardApi } from '../../api/dashboardApi'

const initialState = {
  employee: {
    data: null,
    status: 'idle',
    error: null,
  },
  manager: {
    data: null,
    status: 'idle',
    error: null,
  },
}

export const loadEmployeeDashboard = createAsyncThunk('dashboard/employee', async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApi.employee()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load dashboard')
  }
})

export const loadManagerDashboard = createAsyncThunk('dashboard/manager', async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApi.manager()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load manager dashboard')
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEmployeeDashboard.pending, (state) => {
        state.employee.status = 'loading'
        state.employee.error = null
      })
      .addCase(loadEmployeeDashboard.fulfilled, (state, action) => {
        state.employee.status = 'succeeded'
        state.employee.data = action.payload
      })
      .addCase(loadEmployeeDashboard.rejected, (state, action) => {
        state.employee.status = 'failed'
        state.employee.error = action.payload
      })
      .addCase(loadManagerDashboard.pending, (state) => {
        state.manager.status = 'loading'
        state.manager.error = null
      })
      .addCase(loadManagerDashboard.fulfilled, (state, action) => {
        state.manager.status = 'succeeded'
        state.manager.data = action.payload
      })
      .addCase(loadManagerDashboard.rejected, (state, action) => {
        state.manager.status = 'failed'
        state.manager.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
