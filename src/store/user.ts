import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../utils/client'
import { domain } from '../constants/domain'

// 1 - State for this slice; status: 'pending' | 'loading' | 'complete' | 'error'
const initialState = {
  user: null,
  profile: null,
  status: 'pending',
  profileStatus: 'pending',
  logoutStatus: 'pending',
  sessionTimeout: null,
  error: null
}

// 3 - Async thunks for useDispatch()
export const getUserAsync = createAsyncThunk('user/read', async () => {
  try {
    const response = await client.get(`${domain.apiUrl}/user`)
    return response.data
  } catch (e) {
    return null
  }
})
export const getSignatureAsync = createAsyncThunk(
  'user/signature',
  async (payload: { address }) => {
    const response = await client.get(`${domain.apiUrl}/signature/${payload.address}`)
    return response.data.message
  }
)
export const getCsrfAsync = createAsyncThunk('user/csrf', async () => {
  const response = await client.get(`${domain.apiUrl}/csrf-cookie`)
  return response.data
})
export const authUserAsync = createAsyncThunk(
  'user/auth',
  async (payload: { address; message; signature; chain }) => {
    const response = await client(`${domain.apiUrl}/authenticate`, {
      method: 'POST',
      data: {
        address: payload.address,
        message: payload.message,
        signature: payload.signature,
        chain: payload.chain
      }
    })
    return response.data
  }
)
export const logoutUserAsync = createAsyncThunk('user/logout', async () => {
  const response = await client(`${domain.apiUrl}/logout`)
  return response.data
})

// 2 - reducers for useDispatch()
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userAdded(state, action) {
      state.user = action.payload
    },
    userUpdated(state, action) {
      state.user = action.payload
    },
    userDeleted(state) {
      state.user = {}
    }
  },
  extraReducers(builder) {
    builder
      .addCase(authUserAsync.fulfilled, (state) => {
        state.sessionTimeout = Date.now() + domain.sessionTimeout * 1000
        localStorage.sessionTimeout = state.sessionTimeout
      })
      .addCase(getUserAsync.pending, (state) => {
        state.status = 'loading'
        state.profileStatus = 'pending'
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.status = 'complete'
        state.profileStatus = 'complete'
        state.logoutStatus = 'pending'
        state.user = action.payload?.user
        state.profile = action.payload?.profile

        state.sessionTimeout = parseInt(localStorage.sessionTimeout)
        localStorage.user = JSON.stringify(action.payload?.user)
        localStorage.profile = JSON.stringify(action.payload?.profile)
      })
      .addCase(getUserAsync.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
      .addCase(logoutUserAsync.pending, (state) => {
        state.logoutStatus = 'loading'
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.status = 'pending'
        state.profileStatus = 'pending'
        state.logoutStatus = 'pending'
        state.user = null
        state.profile = null
        localStorage.user = null
        localStorage.profile = null
        localStorage.sessionTimeout = 0
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.logoutStatus = 'complete'
        state.error = action.error.message
      })
  }
})

// 4 - getters for useSelector()
export const getUser = (state) => state.user.user
export const getUserProfile = (state) => state.user.profile
export const getUserProfileStatus = (state) => state.user.profileStatus
export const getUserLogoutStatus = (state) => state.user.logoutStatus
export const getUserStatus = (state) => state.user.status
export const getUserSession = (state) => {
  console.log(1, Date.now())
  console.log(2, state.user.sessionTimeout)
  return state.user.sessionTimeout > Date.now() ? state.user.sessionTimeout : false
}
export const getUserError = (state) => state.user.error

// 5 - Export reducer and actions
export const { userAdded, userUpdated, userDeleted } = userSlice.actions
export default userSlice.reducer
