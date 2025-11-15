import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()
  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute