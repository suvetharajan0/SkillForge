import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardCheck, Target, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { getSkillStyle } from '../utils/skillStyle'
import { CardSkeleton } from '../components/Skeleton'


function getPerformanceLabel(score) {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' }
  if (score >= 70) return { label: 'Good', color: 'text-green-600 dark:text-green-400' }
  return { label: 'Needs Improvement', color: 'text-red-600 dark:text-red-400' }
}


export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()


  const [attempts, setAttempts] = useState([])
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    Promise.all([api.get('/attempts'), api.get('/assessments')])
      .then(([attemptsRes, assessmentsRes]) => {
        setAttempts(attemptsRes.data)
        setAssessments(assessmentsRes.data)
      })
      .catch(() => setError('Could not load dashboard data'))
      .finally(() => setLoading(false))
  }, [])


  const stats = useMemo(() => {
    if (attempts.length === 0) {
      return { taken: 0, avgScore: 0, totalCorrect: 0, bestScore: 0 }
    }
    const taken = attempts.length
    const avgScore = Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / taken)
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctCount, 0)
    const bestScore = Math.max(...attempts.map((a) => a.score))
    return { taken, avgScore, totalCorrect, bestScore }
  }, [attempts])


  const recentAttempts = attempts.slice(0, 3)


  const recommended = useMemo(() => {
    if (assessments.length === 0) return null
    const attemptedIds = new Set(attempts.map((a) => a.assessment?._id))
    const notAttempted = assessments.filter((a) => !attemptedIds.has(a._id))
    if (notAttempted.length > 0) return notAttempted[0]


    const lowest = [...attempts].sort((a, b) => a.score - b.score)[0]
    return assessments.find((a) => a._id === lowest?.assessment?._id) || assessments[0]
  }, [assessments, attempts])


  if (loading) {
    return (
      <div className="px-8 py-8">
        <div className="h-9 w-64 bg-[#e1e3e4] dark:bg-white/10 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    ) 
  } 
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[36px] font-bold text-[#191C1D] dark:text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-1">Keep learning, keep improving!</p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#e3e1ed] dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa]">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#59568A] dark:text-gray-400">Assessments Taken</p>
          </div>
          <p className="text-4xl font-bold text-[#191C1D] dark:text-white">{stats.taken}</p>
        </div>


        <div className="bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#e3e1ed] dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa]">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#59568A] dark:text-gray-400">Average Score</p>
          </div>
          <p className="text-4xl font-bold text-[#191C1D] dark:text-white">{stats.avgScore}%</p>
        </div>


        <div className="bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#e3e1ed] dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#59568A] dark:text-gray-400">Correct Answers</p>
          </div>
          <p className="text-4xl font-bold text-[#191C1D] dark:text-white">{stats.totalCorrect}</p>
        </div>


        <div className="bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#e3e1ed] dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#59568A] dark:text-gray-400">Best Score</p>
          </div>
          <p className="text-4xl font-bold text-[#191C1D] dark:text-white">{stats.bestScore}%</p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Assessments */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] border border-[#e1e3e4] dark:border-white/10 rounded-2xl p-6 shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Recent Assessments
            </h2>
            <Link to="/performance" className="text-sm font-medium text-[#4648D4] dark:text-[#8b8dfa]">
              View all
            </Link>
          </div>


          {recentAttempts.length === 0 ? (
            <p className="text-sm text-[#464554] dark:text-gray-400">
              You haven't taken any assessments yet. Head to the Assessments page to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((a) => {
                const skillStyle = getSkillStyle(a.skill?.name)
                const perf = getPerformanceLabel(a.score)
                return (
                  <Link
                    key={a._id}
                    to={`/attempts/${a._id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f3f4f5] dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${skillStyle.bg} ${skillStyle.text}`}>
                        {a.skill?.name?.slice(0, 2).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#191C1D] dark:text-white">{a.assessment?.title}</p>
                        <p className="text-sm text-[#464554] dark:text-gray-400">
                          Completed on {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#191C1D] dark:text-white">{a.score}%</p>
                      <p className={`text-sm font-medium ${perf.color}`}>{perf.label}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>


        {/* Recommended */}
        <div className="rounded-2xl p-6 border border-[#4648D4]/20 dark:border-[#4648D4]/30 shadow-[0px_4px_20px_rgba(99,102,241,0.05)] dark:shadow-none bg-gradient-to-br from-[#e3dfff] to-[#e1e0ff] dark:from-[#2a2b52] dark:to-[#1f2044]">
          <h2 className="text-lg font-semibold text-[#444173] dark:text-white/90 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Continue Your Journey
          </h2>


          {recommended ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center font-bold text-[#ca8a04] dark:text-yellow-400 shadow-sm dark:shadow-none shrink-0">
                  {recommended.skill?.name?.slice(0, 2).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-[#181445] dark:text-white">{recommended.title}</p>
                  <p className="text-sm text-[#444173]/80 dark:text-gray-300">
                    {recommended.questionCount} Questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/assessments/${recommended._id}/take`)}
                className="w-full bg-[#4648D4] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <p className="text-sm text-[#444173] dark:text-gray-300">No assessments available yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}