import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceApi } from '../../api/attendanceApi'

const initialState = {
  records: [],
  filters: {
    employeeId: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  selectedEmployee: null,
  status: 'idle',
  employeeStatus: 'idle',
  error: null,
  summary: null,
  today: [],
  exportStatus: 'idle',
}

export const fetchTeamRecords = createAsyncThunk('manager/records', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.managerGetAll(params)
    return response.data.records
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load attendance')
  }
})

export const fetchTeamSummary = createAsyncThunk('manager/summary', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.managerSummary(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load summary')
  }
})

export const fetchEmployeeDetails = createAsyncThunk('manager/employee', async (id, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.managerGetEmployee(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load employee details')
  }
})

export const fetchTodayStatus = createAsyncThunk('manager/today', async (_, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.managerTodayStatus()
    return response.data.records
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load today status')
  }
})

export const exportAttendanceCsv = createAsyncThunk('manager/export', async (params, { rejectWithValue }) => {
  try {
    const response = await attendanceApi.exportCsv(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to export CSV')
  }
})

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters(state) {
      state.filters = { ...initialState.filters }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamRecords.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTeamRecords.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.records = action.payload
      })
      .addCase(fetchTeamRecords.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchTeamSummary.fulfilled, (state, action) => {
        state.summary = action.payload
      })
      .addCase(fetchTeamSummary.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(fetchEmployeeDetails.pending, (state) => {
        state.employeeStatus = 'loading'
      })
      .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload
        state.employeeStatus = 'succeeded'
      })
      .addCase(fetchEmployeeDetails.rejected, (state, action) => {
        state.error = action.payload
        state.employeeStatus = 'failed'
        state.selectedEmployee = null
      })
      .addCase(fetchTodayStatus.fulfilled, (state, action) => {
        state.today = action.payload
      })
      .addCase(fetchTodayStatus.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(exportAttendanceCsv.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportAttendanceCsv.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
      })
      .addCase(exportAttendanceCsv.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { setFilter, resetFilters } = managerSlice.actions

export default managerSlice.reducer
