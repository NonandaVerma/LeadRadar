import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice'
import authReducer   from './authSlice'
import leadsReducer  from './leadsSlice'

const store = configureStore({
  reducer: {
    search: searchReducer,
    auth:   authReducer,
    leads:  leadsReducer,
  },
})

export default store