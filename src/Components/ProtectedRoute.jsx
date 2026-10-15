import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
