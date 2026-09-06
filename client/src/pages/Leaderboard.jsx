import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import api from '../api/axios'


export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    api.get('/users/leaderboard')
      .then((res) => setLeaderboard(res.data))
      .catch(() => setError('Could not load leaderboard'))
      .finally(() => setLoading(false))
  }, [])


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading leaderboard...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  return (
    <div className="px-8 py-8">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Leaderboard
      </h1>


      <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl divide-y divide-[#c7c4d7]/20 dark:divide-white/10">
        {leaderboard.map((u) => (
          <div key={u._id} className={`flex items-center justify-between px-6 py-4 ${u.isCurrentUser ? 'bg-[#4648D4]/5 dark:bg-[#4648D4]/10' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                u.rank <= 3 ? 'bg-[#fbbf24] text-white' : 'bg-[#e1e3e4] dark:bg-white/10 text-[#464554] dark:text-gray-300'
              }`}>
                {u.rank <= 3 ? <Trophy className="w-4 h-4" /> : u.rank}
              </div>
              <div>
                <p className={`font-medium ${u.isCurrentUser ? 'text-[#4648D4] dark:text-[#8b8dfa]' : 'text-[#191C1D] dark:text-white'}`}>
                  {u.name} {u.isCurrentUser && '(You)'}
                </p>
                <p className="text-xs text-[#464554] dark:text-gray-400">Level {u.level}</p>
              </div>
            </div>
            <p className="font-semibold text-[#191C1D] dark:text-white">{u.xp} XP</p>
          </div>
        ))}
      </div>
    </div>
  )
}