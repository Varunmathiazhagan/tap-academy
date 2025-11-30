import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api/authApi'

const tokenKey = 'accessToken'
const userKey = 'authUser'
const settingsKey = 'attendanceSettings'

const hasWindow = typeof window !== 'undefined'

const safeStorage = {
  get(key) {
    if (!hasWindow) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, value) {
    if (!hasWindow) return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Ignore storage failures (private browsing, etc.)
    }
  },
  remove(key) {
    if (!hasWindow) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore storage failures (private browsing, etc.)
    }
  },
}

const readJson = (key) => {
  const raw = safeStorage.get(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persistedToken = safeStorage.get(tokenKey) || null
const persistedUser = readJson(userKey)
const persistedSettings = readJson(settingsKey)

const initialState = {
  user: persistedUser,
  token: persistedToken,
  settings: persistedSettings,
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
        if (action.payload.settings) {
          state.settings = action.payload.settings
          safeStorage.set(settingsKey, JSON.stringify(action.payload.settings))
        }
        safeStorage.set(tokenKey, action.payload.token)
        safeStorage.set(userKey, JSON.stringify(action.payload.user))
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
        if (action.payload.settings) {
          state.settings = action.payload.settings
          safeStorage.set(settingsKey, JSON.stringify(action.payload.settings))
        }
        safeStorage.set(tokenKey, action.payload.token)
        safeStorage.set(userKey, JSON.stringify(action.payload.user))
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
        if (action.payload.settings) {
          state.settings = action.payload.settings
          safeStorage.set(settingsKey, JSON.stringify(action.payload.settings))
        }
        safeStorage.set(userKey, JSON.stringify(action.payload.user))
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.user = null
        state.token = null
        state.settings = null
        safeStorage.remove(tokenKey)
        safeStorage.remove(userKey)
        safeStorage.remove(settingsKey)
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        state.settings = null
        safeStorage.remove(tokenKey)
        safeStorage.remove(userKey)
        safeStorage.remove(settingsKey)
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        state.settings = null
        safeStorage.remove(tokenKey)
        safeStorage.remove(userKey)
        safeStorage.remove(settingsKey)
      })
  },
})

export default authSlice.reducer
