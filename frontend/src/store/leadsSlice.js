import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// ── Helper — attach JWT to every request ──────────────────────────────────────
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
})

// ── Async thunks ──────────────────────────────────────────────────────────────

export const saveScan = createAsyncThunk(
  'leads/saveScan',
  async ({ token, payload }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/v1/leads/save', payload, authHeaders(token))
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to save scan.')
    }
  }
)

export const fetchAllScans = createAsyncThunk(
  'leads/fetchAllScans',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/v1/leads', authHeaders(token))
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch scans.')
    }
  }
)

export const fetchScanResults = createAsyncThunk(
  'leads/fetchScanResults',
  async ({ token, scanId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/v1/leads/${scanId}`,
        { ...authHeaders(token), params: { page, limit: 15 } }
      )
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch results.')
    }
  }
)

export const deleteScan = createAsyncThunk(
  'leads/deleteScan',
  async ({ token, scanId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/leads/${scanId}`, authHeaders(token))
      return scanId
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete scan.')
    }
  }
)

export const updateLeadStatus = createAsyncThunk(
  'leads/updateLeadStatus',
  async ({ token, resultId, leadStatus, notes }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/api/v1/leads/result/${resultId}`,
        { leadStatus, notes },
        authHeaders(token)
      )
      return { resultId, leadStatus, notes }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update lead.')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    scans:        [],
    currentScan:  null,
    results:      [],
    totalResults: 0,
    totalPages:   0,
    currentPage:  1,
    status:       'idle',
    saveStatus:   'idle',
    error:        null,
  },
  reducers: {
    clearCurrentScan(state) {
      state.currentScan = null
      state.results     = []
      state.totalResults = 0
      state.totalPages  = 0
      state.currentPage = 1
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllScans
      .addCase(fetchAllScans.pending,   (state) => { state.status = 'loading' })
      .addCase(fetchAllScans.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.scans  = action.payload
      })
      .addCase(fetchAllScans.rejected,  (state, action) => {
        state.status = 'failed'
        state.error  = action.payload
      })

      // fetchScanResults
      .addCase(fetchScanResults.pending,   (state) => { state.status = 'loading' })
      .addCase(fetchScanResults.fulfilled, (state, action) => {
        state.status       = 'succeeded'
        state.currentScan  = action.payload.scan
        state.results      = action.payload.results
        state.totalResults = action.payload.total
        state.totalPages   = action.payload.totalPages
        state.currentPage  = action.payload.page
      })
      .addCase(fetchScanResults.rejected,  (state, action) => {
        state.status = 'failed'
        state.error  = action.payload
      })

      // saveScan
      .addCase(saveScan.pending,   (state) => { state.saveStatus = 'loading' })
      .addCase(saveScan.fulfilled, (state) => { state.saveStatus = 'succeeded' })
      .addCase(saveScan.rejected,  (state, action) => {
        state.saveStatus = 'failed'
        state.error      = action.payload
      })

      // deleteScan
      .addCase(deleteScan.fulfilled, (state, action) => {
        state.scans = state.scans.filter(s => s.scanId !== action.payload)
      })

      // updateLeadStatus
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const { resultId, leadStatus, notes } = action.payload
        const result = state.results.find(r => r.resultId === resultId)
        if (result) {
          if (leadStatus !== undefined) result.leadStatus = leadStatus
          if (notes      !== undefined) result.notes      = notes
        }
      })
  },
})

export const { clearCurrentScan, setCurrentPage } = leadsSlice.actions
export default leadsSlice.reducer