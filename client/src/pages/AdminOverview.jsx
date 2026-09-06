import { useState, useEffect } from 'react'
import { Users, ClipboardList, HelpCircle, Layers, Activity, Target } from 'lucide-react'
import api from '../api/axios'


export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load admin stats'))
      .finally(() => setLoading(false))
  }, [])


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  const cards = [
    { label: 'Total Users', value: stats.userCount, icon: Users },
    { label: 'Assessments', value: stats.assessmentCount, icon: ClipboardList },
    { label: 'Questions', value: stats.questionCount, icon: HelpCircle },
    { label: 'Skills', value: stats.skillCount, icon: Layers },
    { label: 'Total Attempts', value: stats.attemptCount, icon: Activity },
    { label: 'Platform Avg Score', value: `${stats.platformAverageScore}%`, icon: Target },
  ]


  return (
    <div className="px-8 py-8">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Admin Overview
      </h1>
      <p className="text-[#464554] dark:text-gray-400 mb-8">Platform-wide statistics.</p>


      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e3e1ed] dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa]">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[#59568A] dark:text-gray-400">{label}</p>
            </div>
            <p className="text-3xl font-bold text-[#191C1D] dark:text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
