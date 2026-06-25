import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from './store/authSlice'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Landing  from './pages/Landing'
import Register from './pages/Register'
import Login    from './pages/Login'

// Dashboard layout + pages
import DashboardLayout   from './pages/dashboard/DashboardLayout'
import Home              from './pages/dashboard/Home'
import SearchLeads       from './pages/dashboard/SearchLeads'
import Analytics         from './pages/dashboard/Analytics'
import AnalyticsDetail   from './pages/dashboard/AnalyticsDetail'

export default function App() {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<Landing />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/login"    element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}    />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardLayout /></ProtectedRoute>
        }>
          <Route index                   element={<Home />}            />
          <Route path="search"           element={<SearchLeads />}     />
          <Route path="analytics"        element={<Analytics />}       />
          <Route path="analytics/:scanId" element={<AnalyticsDetail />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}