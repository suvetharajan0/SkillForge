
import { useState, useEffect, useMemo } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { Star, TrendingDown, Rocket } from 'lucide-react'
import api from '../api/axios'


export default function SkillProfile() {
  const [topicPerformance, setTopicPerformance] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    Promise.all([api.get('/attempts/performance'), api.get('/attempts')])
      .then(([perfRes, attemptsRes]) => {
        setTopicPerformance(perfRes.data)
        setAttempts(attemptsRes.data)
      })
      .catch(() => setError('Could not load skill profile'))
      .finally(() => setLoading(false))
  }, [])


  const overallProgress = useMemo(() => {
    if (attempts.length === 0) return 0
    return Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
  }, [attempts])


  const radarData = useMemo(
    () => topicPerformance.map((t) => ({ skill: t.skillName, score: t.averageScore })),
    [topicPerformance]
  )


  const strongestSkills = useMemo(
    () => [...topicPerformance].sort((a, b) => b.averageScore - a.averageScore).slice(0, 3),
    [topicPerformance]
  )


  const skillsToImprove = useMemo(
    () =>
      [...topicPerformance]
        .filter((t) => t.averageScore < 70)
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 3),
    [topicPerformance]
  )


  const recentlyImproved = useMemo(() => {
    const bySkill = {}
    attempts.forEach((a) => {
      const skillId = a.skill?._id
      if (!skillId) return
      if (!bySkill[skillId]) bySkill[skillId] = []
      bySkill[skillId].push(a)
    })


    const improvements = []
    Object.values(bySkill).forEach((skillAttempts) => {
      if (skillAttempts.length < 2) return
      const [latest, previous] = skillAttempts
      const delta = latest.score - previous.score
      if (delta > 0) {
        improvements.push({ skillName: latest.skill.name, delta })
      }
    })


    return improvements.sort((a, b) => b.delta - a.delta).slice(0, 3)
  }, [attempts])


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading skill profile...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <h1 className="text-[36px] font-bold text-[#191C1D] dark:text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Skill Profile
        </h1>
        <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-1">Track your skills and improvement.</p>
      </div>


      {topicPerformance.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/50 dark:border-white/10 rounded-xl p-8 text-center text-[#464554] dark:text-gray-400">
          Complete an assessment to start building your skill profile.
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/50 dark:border-white/10 rounded-xl p-6 flex items-center justify-between gap-8 mb-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
            <div className="shrink-0">
              <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Your Skill Profile
              </h2>
              <p className="text-sm text-[#464554] dark:text-gray-400 mt-1">
                Overall Progress: <span className="font-semibold text-[#4648D4] dark:text-[#8b8dfa]">{overallProgress}%</span>. Keep practicing to reach mastery!
              </p>
            </div>
            <div className="flex-1 h-3 bg-[#e7e8e9] dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#4648D4] rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/50 dark:border-white/10 rounded-xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
              <h3 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Skill Overview
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--radar-grid-color, #e1e3e4)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--radar-label-color, #464554)', fontSize: 12 }} />
                    <Radar dataKey="score" stroke="#4648D4" fill="#4648D4" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>


            <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/50 dark:border-white/10 rounded-xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
              <h3 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Skill Details
              </h3>
              <div className="space-y-5">
                {topicPerformance.map((t) => (
                  <div key={t.skillId}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-semibold text-[#191C1D] dark:text-white">{t.skillName}</span>
                      <span className="font-semibold text-[#464554] dark:text-gray-400">{t.averageScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#e1e3e4] dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${t.averageScore < 70 ? 'bg-[#59568A]' : 'bg-[#4648D4]'}`}
                        style={{ width: `${t.averageScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/50 dark:border-white/10 rounded-xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
            <h3 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#f3f4f5] dark:bg-white/5 border border-[#c7c4d7]/30 dark:border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-[#4648D4] dark:text-[#8b8dfa]" />
                  <span className="text-xs font-bold text-[#4648D4] dark:text-[#8b8dfa] uppercase tracking-wide">Strongest Skills</span>
                </div>
                {strongestSkills.length === 0 ? (
                  <p className="text-sm text-[#464554] dark:text-gray-400">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {strongestSkills.map((s) => (
                      <div key={s.skillId} className="flex items-center justify-between">
                        <span className="text-sm text-[#191C1D] dark:text-white">{s.skillName}</span>
                        <span className="text-xs font-semibold text-[#4648D4] dark:text-[#8b8dfa] bg-[#4648D4]/10 dark:bg-[#4648D4]/20 px-2 py-1 rounded-md">
                          {s.averageScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              <div className="bg-[#f3f4f5] dark:bg-white/5 border border-[#c7c4d7]/30 dark:border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-4 h-4 text-[#59568A] dark:text-purple-300" />
                  <span className="text-xs font-bold text-[#59568A] dark:text-purple-300 uppercase tracking-wide">Skills to Improve</span>
                </div>
                {skillsToImprove.length === 0 ? (
                  <p className="text-sm text-[#464554] dark:text-gray-400">Nice work — no weak areas identified!</p>
                ) : (
                  <div className="space-y-3">
                    {skillsToImprove.map((s) => (
                      <div key={s.skillId} className="flex items-center justify-between">
                        <span className="text-sm text-[#191C1D] dark:text-white">{s.skillName}</span>
                        <span className="text-xs font-semibold text-[#59568A] dark:text-purple-300 bg-[#59568A]/10 dark:bg-purple-400/10 px-2 py-1 rounded-md">
                          {s.averageScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              <div className="bg-[#f3f4f5] dark:bg-white/5 border border-[#c7c4d7]/30 dark:border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-4 h-4 text-[#10B981] dark:text-green-400" />
                  <span className="text-xs font-bold text-[#10B981] dark:text-green-400 uppercase tracking-wide">Recently Improved</span>
                </div>
                {recentlyImproved.length === 0 ? (
                  <p className="text-sm text-[#464554] dark:text-gray-400">Retake an assessment to track your improvement here.</p>
                ) : (
                  <div className="space-y-3">
                    {recentlyImproved.map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-[#191C1D] dark:text-white">{s.skillName}</span>
                        <span className="text-xs font-semibold text-[#10B981] dark:text-green-400 bg-[#10B981]/10 dark:bg-green-400/10 px-2 py-1 rounded-md">
                          +{s.delta}% improvement
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}