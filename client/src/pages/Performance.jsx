import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import api from '../api/axios'


export default function Performance() {
  const [attempts, setAttempts] = useState([])
  const [topicPerformance, setTopicPerformance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    Promise.all([api.get('/attempts'), api.get('/attempts/performance')])
      .then(([historyRes, perfRes]) => {
        setAttempts(historyRes.data)
        setTopicPerformance(perfRes.data)
      })
      .catch(() => setError('Could not load performance data'))
      .finally(() => setLoading(false))
  }, [])


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  return (
    <div className="px-8 py-8">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        My Performance
      </h1>


      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-4">Topic Performance</h2>
        {topicPerformance.length === 0 ? (
          <p className="text-[#464554] dark:text-gray-400 text-sm">Complete an assessment to see your skill breakdown here.</p>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {topicPerformance.map((t) => (
              <div key={t.skillId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#191C1D] dark:text-white">{t.skillName}</span>
                  <span className="text-sm text-[#464554] dark:text-gray-400">
                    {t.averageScore}% avg · {t.attemptsCount} attempt{t.attemptsCount !== 1 ? 's' : ''} · best {t.bestScore}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#e7e8e9] dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4648D4] rounded-full" style={{ width: `${t.averageScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      <section>
        <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-4">Recent Attempts</h2>
        {attempts.length === 0 ? (
          <p className="text-[#464554] dark:text-gray-400 text-sm">You haven't taken any assessments yet.</p>
        ) : (
          <div className="border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl divide-y divide-[#c7c4d7]/20 dark:divide-white/10">
            {attempts.map((a) => (
              <Link
                key={a._id}
                to={`/attempts/${a._id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-[#f3f4f5] dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {a.passed
                    ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  <div>
                    <p className="text-sm font-medium text-[#191C1D] dark:text-white">{a.assessment?.title}</p>
                    <p className="text-xs text-[#464554] dark:text-gray-400">
                      {a.skill?.name} · {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${a.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {a.score}%
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}