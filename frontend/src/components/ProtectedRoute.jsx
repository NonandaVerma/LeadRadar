import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from '../store/authSlice'

/**
 * Wraps any route that requires authentication.
 * If no token → redirect to /login.
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" replace />
}