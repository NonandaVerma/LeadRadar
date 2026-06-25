import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const searchCity = createAsyncThunk(
  'search/searchCity',
  async ({ city, category }, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/search', { params: { city, category } })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch. Try again.')
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    city:         '',
    category:     'all',
    places:       [],
    total:        0,
    noWebsite:    0,
    hasWebsite:   0,
    status:       'idle',
    error:        null,
    filter:       'all',
    searchedOnce: false,
  },
  reducers: {
    setFilter:   (state, action) => { state.filter   = action.payload },
    setCategory: (state, action) => { state.category = action.payload },
    setCity:     (state, action) => { state.city     = action.payload },
    clearResults:(state) => {
      state.places = []; state.status = 'idle'
      state.error  = null; state.searchedOnce = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCity.pending,   (state) => {
        state.status = 'loading'; state.error = null; state.searchedOnce = true
      })
      .addCase(searchCity.fulfilled, (state, action) => {
        state.status     = 'succeeded'
        state.places     = action.payload.places
        state.total      = action.payload.total
        state.noWebsite  = action.payload.noWebsite
        state.hasWebsite = action.payload.hasWebsite
        state.city       = action.payload.city
        state.category   = action.payload.category
      })
      .addCase(searchCity.rejected,  (state, action) => {
        state.status = 'failed'; state.error = action.payload
      })
  },
})

export const { setFilter, setCategory, setCity, clearResults } = searchSlice.actions

export const selectFilteredPlaces = (state) => {
  const { places, filter } = state.search
  if (filter === 'noWebsite')  return places.filter(p => !p.hasWebsite)
  if (filter === 'hasWebsite') return places.filter(p => p.hasWebsite)
  return places
}

export default searchSlice.reducer
