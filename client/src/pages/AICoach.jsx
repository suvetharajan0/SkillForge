import { useState, useEffect } from 'react'
import { Bot, Sparkles, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import api from '../api/axios'


function PracticeQuestion({ q, index }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)


  return (
    <div className="border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-[#1a1b23]">
      <p className="font-medium text-[#191C1D] dark:text-white mb-4">{index + 1}. {q.questionText}</p>
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
              className={`w-full text-left px-4 py-2.5 border rounded-lg text-sm transition-colors ${style}`}
              disabled={revealed}
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
          Check Answer
        </button>
      ) : (
        <div className={`mt-4 flex items-start gap-2 text-sm rounded-lg p-3 ${
          selected === q.correctAnswerIndex
            ? 'bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400'
        }`}>
          {selected === q.correctAnswerIndex ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <p>{q.explanation}</p>
        </div>
      )}
    </div>
  )
}


export default function AICoach() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const [practiceFor, setPracticeFor] = useState(null)
  const [practiceQuestions, setPracticeQuestions] = useState(null)
  const [generating, setGenerating] = useState(false)


  useEffect(() => {
    api.get('/ai-coach/insights')
      .then((res) => setInsights(res.data))
      .catch(() => setError('Could not load AI coaching insights'))
      .finally(() => setLoading(false))
  }, [])


  const handleGenerate = async (skill) => {
    setPracticeFor(skill.skillName)
    setPracticeQuestions(null)
    setGenerating(true)
    setError('')
    try {
      const res = await api.post('/ai-coach/practice-questions', { skillId: skill.skillId })
      setPracticeQuestions(res.data.questions)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate practice questions')
    } finally {
      setGenerating(false)
    }
  }


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading your AI coach...</div>
  if (error && !insights) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#4648D4] flex items-center justify-center text-white">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AI Coach
          </h1>
          <p className="text-[#464554] dark:text-gray-400 text-sm">Personalized guidance based on your performance</p>
        </div>
      </div>


      <div className="bg-gradient-to-br from-[#4648D4] to-[#6063ee] text-white rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3 text-white/80 text-xs font-semibold uppercase tracking-wide">
          <Sparkles className="w-4 h-4" /> Coaching Insight
        </div>
        <p className="leading-relaxed">{insights.advice}</p>
      </div>


      {insights.weakSkills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-4">Focus Areas</h2>
          <div className="space-y-3">
            {insights.weakSkills.map((s) => (
              <div key={s.skillId} className="border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-4 flex items-center justify-between bg-white dark:bg-[#1a1b23]">
                <div>
                  <p className="font-medium text-[#191C1D] dark:text-white">{s.skillName}</p>
                  <p className="text-sm text-[#464554] dark:text-gray-400">{s.averageScore}% average</p>
                </div>
                <button
                  onClick={() => handleGenerate(s)}
                  className="bg-[#e3e1ed] dark:bg-[#4648D4]/20 text-[#4648D4] dark:text-[#8b8dfa] text-sm font-medium px-4 py-2 rounded-lg"
                >
                  Generate Practice Questions
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {practiceFor && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-4">Practice: {practiceFor}</h2>
          {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}
          {generating ? (
            <div className="flex items-center gap-2 text-[#464554] dark:text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating questions with AI...
            </div>
          ) : (
            <div className="space-y-4">
              {practiceQuestions?.map((q, i) => (
                <PracticeQuestion key={i} q={q} index={i} />
              ))}
            </div>
          )}
        </div>
      )}


      {insights.strongSkills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-4">Your Strengths</h2>
          <div className="flex flex-wrap gap-2">
            {insights.strongSkills.map((s) => (
              <span key={s.skillId} className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-medium px-3 py-1.5 rounded-full">
                {s.skillName} — {s.averageScore}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
