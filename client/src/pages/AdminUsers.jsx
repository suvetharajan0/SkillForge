import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
   const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const loadUsers = () => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => setError('Could not load users'))
      .finally(() => setLoading(false))
  }


  useEffect(loadUsers, [])


  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    try {
      await api.put(`/admin/users/${u._id}/role`, { role: newRole })
      toast.success(`${u.name} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`)
      loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role')
    }
  }


  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${u._id}`)
      toast.success(`${u.name} was removed`)
      loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete user')
    }
  }


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  return (
    <div className="px-8 py-8">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        User Management
      </h1>
      <p className="text-[#464554] dark:text-gray-400 mb-8">{users.length} registered users</p>


      <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f3f4f5] dark:bg-white/5 text-left text-[#59568A] dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c7c4d7]/20 dark:divide-white/10">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-5 py-3 text-[#191C1D] dark:text-white font-medium">{u.name}</td>
                <td className="px-5 py-3 text-[#464554] dark:text-gray-400">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    u.role === 'admin'
                      ? 'bg-[#4648D4]/10 dark:bg-[#4648D4]/20 text-[#4648D4] dark:text-[#8b8dfa]'
                      : 'bg-[#e1e3e4] dark:bg-white/10 text-[#464554] dark:text-gray-300'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#464554] dark:text-gray-400">{u.level}</td>
                <td className="px-5 py-3 text-[#464554] dark:text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right space-x-3">
                  {u._id === currentUser?._id ? (
                    <span className="text-xs text-[#9a9aa2] dark:text-gray-500">(you)</span>
                  ) : (
                    <>
                      <button onClick={() => toggleRole(u)} className="text-[#4648D4] dark:text-[#8b8dfa] text-xs font-semibold">
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button onClick={() => handleDelete(u)} className="text-red-600 dark:text-red-400 text-xs font-semibold">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}