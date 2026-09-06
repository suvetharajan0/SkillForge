import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()


  if (loading) {
    return <div className="px-8 py-8 text-[#464554]">Loading...</div>
  }


  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }


  return children
}
