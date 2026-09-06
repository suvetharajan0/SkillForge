import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react'
import api from '../api/axios'


const DIFFICULTY_STYLES = {
  easy: { label: 'Easy', bg: 'bg-[#d1fae5] dark:bg-green-500/15', text: 'text-[#047857] dark:text-green-400' },
  medium: { label: 'Medium', bg: 'bg-[#ffedd5] dark:bg-orange-500/15', text: 'text-[#c2410c] dark:text-orange-400' },
  hard: { label: 'Hard', bg: 'bg-[#fee2e2] dark:bg-red-500/15', text: 'text-[#b91c1c] dark:text-red-400' },
}


function QuestionCard({ q }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const diff = DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.medium


  return (
    <div className="border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-[#1a1b23]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#e3e1ed] dark:bg-[#4648D4]/20 text-[#4648D4] dark:text-[#8b8dfa]">
          {q.skill?.name || 'Unknown skill'}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${diff.bg} ${diff.text}`}>
          {diff.label}
        </span>
      </div>


      <p className="font-medium text-[#191C1D] dark:text-white mb-4">{q.questionText}</p>


      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrectOption = i === q.correctAnswerIndex
          let style = 'border-[#c7c4d7]/50 dark:border-white/10 text-[#191C1D] dark:text-gray-200'
          if (revealed && isCorrectOption) style = 'border-green-500 bg-green-50 dark:bg-green-500/10 dark:border-green-500 text-[#191C1D] dark:text-white'
          else if (revealed && isSelected && !isCorrectOption) style = 'border-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500 text-[#191C1D] dark:text-white'
          else if (isSelected) style = 'border-[#4648D4] text-[#191C1D] dark:text-white'


          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              className={`w-full text-left px-4 py-2.5 border rounded-lg text-sm transition-colors ${style}`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          )
        })}
      </div>


      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          disabled={selected === null}
          className="mt-4 text-sm font-semibold text-[#4648D4] dark:text-[#8b8dfa] disabled:opacity-40"
        >
          Reveal Answer
        </button>
      ) : (
        <div className={`mt-4 flex items-start gap-2 text-sm rounded-lg p-3 ${
          selected === q.correctAnswerIndex
            ? 'bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400'
        }`}>
          {selected === q.correctAnswerIndex ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <p>{q.explanation || 'No explanation provided for this question.'}</p>
        </div>
      )}
    </div>
  )
}


export default function QuestionBank() {
  const { searchQuery } = useOutletContext()


  const [questions, setQuestions] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const [skillFilter, setSkillFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')


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
      .get('/questions', { params })
      .then((res) => setQuestions(res.data))
      .catch(() => setError('Could not load questions'))
      .finally(() => setLoading(false))
  }, [skillFilter, levelFilter])


  const visibleQuestions = useMemo(() => {
    if (!searchQuery) return questions
    return questions.filter((q) => q.questionText.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [questions, searchQuery])


  return (
    <div className="px-8 py-8">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white flex items-center gap-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <BookOpen className="w-6 h-6 text-[#4648D4] dark:text-[#8b8dfa]" />
            Question Bank
          </h1>
          <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-1">
            Browse and practice questions from every skill.
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
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>


      {loading && <p className="text-[#464554] dark:text-gray-400">Loading questions...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && !error && visibleQuestions.length === 0 && (
        <p className="text-[#464554] dark:text-gray-400">No questions match your filters yet.</p>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visibleQuestions.map((q) => (
          <QuestionCard key={q._id} q={q} />
        ))}
      </div>
    </div>
  )
}