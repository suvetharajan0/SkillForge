import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ListChecks, Clock, Code2 } from 'lucide-react'
import api from '../api/axios'
import { getSkillStyle } from '../utils/skillStyle'
import { Skeleton } from '../components/Skeleton'


const DIFFICULTY_STYLES = {
  easy: { label: 'Beginner', bg: 'bg-[#d1fae5] dark:bg-green-500/15', text: 'text-[#047857] dark:text-green-400' },
  medium: { label: 'Intermediate', bg: 'bg-[#ffedd5] dark:bg-orange-500/15', text: 'text-[#c2410c] dark:text-orange-400' },
  hard: { label: 'Advanced', bg: 'bg-[#fee2e2] dark:bg-red-500/15', text: 'text-[#b91c1c] dark:text-red-400' },
  mixed: { label: 'Mixed', bg: 'bg-[#e3e1ed] dark:bg-[#4648D4]/15', text: 'text-[#4648D4] dark:text-[#8b8dfa]' },
}


export default function Assessments() {
  const { searchQuery } = useOutletContext()
  const navigate = useNavigate()


  const [assessments, setAssessments] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const [skillFilter, setSkillFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [sortBy, setSortBy] = useState('title')


  useEffect(() => {
    api.get('/skills').then((res) => setSkills(res.data)).catch(() => {})
  }, [])


  useEffect(() => {
    setLoading(true)
    setError('')
    const params = {}
    if (skillFilter) params.skill = skillFilter
    if (levelFilter) params.difficulty = levelFilter


    api
      .get('/assessments', { params })
      .then((res) => setAssessments(res.data))
      .catch(() => setError('Could not load assessments'))
      .finally(() => setLoading(false))
  }, [skillFilter, levelFilter])


  const visibleAssessments = useMemo(() => {
    let list = [...assessments]


    if (searchQuery) {
      list = list.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }


    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'questions') {
      list.sort((a, b) => b.questionCount - a.questionCount)
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.timeLimit - b.timeLimit)
    }


    return list
  }, [assessments, searchQuery, sortBy])


  return (
    <div className="px-8 py-8">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Assessments
          </h1>
          <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-1">
            Choose a skill and start your assessment
          </p>
        </div>


        <div className="flex gap-3 flex-wrap">
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="border border-[#C7C4D7] dark:border-white/10 rounded-lg px-4 py-2 text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white"
          >
            <option value="">All Skills</option>
            {skills.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>


          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-[#C7C4D7] dark:border-white/10 rounded-lg px-4 py-2 text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="easy">Beginner</option>
            <option value="medium">Intermediate</option>
            <option value="hard">Advanced</option>
            <option value="mixed">Mixed</option>
          </select>


          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#C7C4D7] dark:border-white/10 rounded-lg px-4 py-2 text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white"
          >
            <option value="title">Sort: Title</option>
            <option value="questions">Sort: Most Questions</option>
            <option value="time">Sort: Shortest Time</option>
          </select>
        </div>
      </div>


     {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/20 dark:border-white/10 rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-16 h-6 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && !error && visibleAssessments.length === 0 && (
        <p className="text-[#464554] dark:text-gray-400">No assessments match your filters yet.</p>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleAssessments.map((assessment) => {
          const diff = DIFFICULTY_STYLES[assessment.difficulty] || DIFFICULTY_STYLES.mixed
          const skillStyle = getSkillStyle(assessment.skill?.name)


          return (
            <div
              key={assessment._id}
              className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/20 dark:border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-[0px_4px_10px_rgba(99,102,241,0.05)] dark:shadow-none"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${skillStyle.bg} ${skillStyle.text}`}>
                    {assessment.skill?.name
                      ? assessment.skill.name.slice(0, 2).toUpperCase()
                      : <Code2 className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${diff.bg} ${diff.text}`}>
                    {diff.label}
                  </span>
                </div>


                <h3 className="text-[20px] font-semibold text-[#191C1D] dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {assessment.title}
                </h3>
                <p className="text-sm text-[#464554] dark:text-gray-400 mb-6">
                  {assessment.description}
                </p>
              </div>


              <div className="border-t border-[#c7c4d7]/20 dark:border-white/10 pt-4 flex items-center justify-between">
                <div className="flex gap-4 text-xs text-[#464554] dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <ListChecks className="w-3.5 h-3.5" />
                    {assessment.questionCount} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {assessment.timeLimit} mins
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/assessments/${assessment._id}/take`)}
                  className="bg-[#e3e1ed] dark:bg-[#4648D4]/20 text-[#4648D4] dark:text-[#8b8dfa] text-sm font-medium px-4 py-1.5 rounded-lg"
                >
                  Start
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}