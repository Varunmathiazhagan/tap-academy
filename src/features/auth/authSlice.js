import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api/authApi'

const tokenKey = 'accessToken'
const userKey = 'authUser'

const persistedToken = localStorage.getItem(tokenKey) || null
const persistedUser = localStorage.getItem(userKey)

const initialState = {
  user: persistedUser ? JSON.parse(persistedUser) : null,
  token: persistedToken,
  status: 'idle',
  error: null,
}

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const response = await authApi.register(payload)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed')
  }
})

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await authApi.login(payload)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.me()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load profile')
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem(tokenKey, action.payload.token)
        localStorage.setItem(userKey, JSON.stringify(action.payload.user))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem(tokenKey, action.payload.token)
        localStorage.setItem(userKey, JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        localStorage.setItem(userKey, JSON.stringify(action.payload.user))
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.user = null
        state.token = null
        localStorage.removeItem(tokenKey)
        localStorage.removeItem(userKey)
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        localStorage.removeItem(tokenKey)
        localStorage.removeItem(userKey)
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        localStorage.removeItem(tokenKey)
        localStorage.removeItem(userKey)
      })
  },
})

export default authSlice.reducer
