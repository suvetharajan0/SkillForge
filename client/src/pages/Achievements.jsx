import { useState, useEffect } from 'react'
import { Award, Lock } from 'lucide-react'
import api from '../api/axios'


export default function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    api.get('/achievements')
      .then((res) => setAchievements(res.data))
      .catch(() => setError('Could not load achievements'))
      .finally(() => setLoading(false))
  }, [])


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading achievements...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  const unlockedCount = achievements.filter((a) => a.unlocked).length


  return (
    <div className="px-8 py-8">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Achievements
      </h1>
      <p className="text-[#464554] dark:text-gray-400 mb-8">{unlockedCount} of {achievements.length} unlocked</p>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((a) => (
          <div
            key={a._id}
            className={`border rounded-xl p-6 flex items-start gap-4 ${
              a.unlocked
                ? 'bg-white dark:bg-[#1a1b23] border-[#4648D4]/30 dark:border-[#4648D4]/30 shadow-[0px_4px_10px_rgba(99,102,241,0.08)] dark:shadow-none'
                : 'bg-[#f3f4f5] dark:bg-white/5 border-[#c7c4d7]/30 dark:border-white/10'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              a.unlocked ? 'bg-[#4648D4] text-white' : 'bg-[#e1e3e4] dark:bg-white/10 text-[#9a9aa2] dark:text-gray-500'
            }`}>
              {a.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <p className={`font-semibold ${a.unlocked ? 'text-[#191C1D] dark:text-white' : 'text-[#767586] dark:text-gray-500'}`}>{a.title}</p>
              <p className="text-sm text-[#464554] dark:text-gray-400 mt-1">{a.description}</p>
              {a.unlocked && (
                <p className="text-xs text-[#4648D4] dark:text-[#8b8dfa] font-medium mt-2">
                  Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}