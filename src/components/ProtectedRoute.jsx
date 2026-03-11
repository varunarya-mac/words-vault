import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from './Spinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Spinner fullScreen />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
