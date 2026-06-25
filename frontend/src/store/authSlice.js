import { createSlice } from '@reduxjs/toolkit'

// Load persisted session from localStorage on app start
const storedUser  = localStorage.getItem('lr_user')
const storedToken = localStorage.getItem('lr_token')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:  storedUser  ? JSON.parse(storedUser) : null,
    token: storedToken ? storedToken            : null,
  },
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload
      state.user  = user
      state.token = token
      // Persist to localStorage — survives page refresh
      localStorage.setItem('lr_user',  JSON.stringify(user))
      localStorage.setItem('lr_token', token)
    },
    logout(state) {
      state.user  = null
      state.token = null
      // Clear session — next login creates fresh token
      localStorage.removeItem('lr_user')
      localStorage.removeItem('lr_token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

// Selectors
export const selectCurrentUser  = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsLoggedIn   = (state) => !!state.auth.token

export default authSlice.reducer