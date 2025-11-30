import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceApi } from '../../api/attendanceApi'

const initialState = {
  history: [],
  summary: { present: 0, absent: 0, late: 0, 'half-day': 0, totalHours: 0 },
  today: null,
  loading: false,
  error: null,
  lastUpdated: null,
}

export const loadHistory = createAsyncThunk('attendance/history', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.getMyHistory(params)
    return response.data.records
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load history')
  }
})

export const loadSummary = createAsyncThunk('attendance/summary', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.getMySummary(params)
    return response.data.summary
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load summary')
  }
})

export const loadToday = createAsyncThunk('attendance/today', async (_, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.getToday()
    return response.data.attendance
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load today status')
  }
})

export const performCheckIn = createAsyncThunk('attendance/checkIn', async (_, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.checkIn()
    return response.data.attendance
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Check-in failed')
  }
})

export const performCheckOut = createAsyncThunk('attendance/checkOut', async (_, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.checkOut()
    return response.data.attendance
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Check-out failed')
  }
})

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.loading = false
        state.history = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(loadHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loadSummary.fulfilled, (state, action) => {
        state.summary = action.payload
      })
      .addCase(loadSummary.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(loadToday.fulfilled, (state, action) => {
        state.today = action.payload
      })
      .addCase(loadToday.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(performCheckIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(performCheckIn.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
        state.error = null
        state.history = [action.payload, ...state.history.filter((record) => record._id !== action.payload._id)]
      })
      .addCase(performCheckIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(performCheckOut.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(performCheckOut.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
        state.error = null
        state.history = state.history.map((record) =>
          record._id === action.payload._id ? action.payload : record
        )
      })
      .addCase(performCheckOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default attendanceSlice.reducer
