import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import ResultReview from '../components/ResultReview'


function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}


export default function TakeAssessment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()


  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState(new Set())
  const [secondsLeft, setSecondsLeft] = useState(0)


  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)


  useEffect(() => {
    api
      .get(`/assessments/${id}`)
      .then((res) => {
        setAssessment(res.data)
        setSecondsLeft(res.data.timeLimit * 60)
      })
      .catch(() => setError('Could not load this assessment'))
      .finally(() => setLoading(false))
  }, [id])


  const handleSubmit = useCallback(async () => {
    if (submitting || result) return
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({
          questionId,
          selectedIndex,
        })),
      }
      const res = await api.post(`/assessments/${id}/submit`, payload)
      setResult(res.data)
      refreshUser()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit assessment')
    } finally {
      setSubmitting(false)
    }
  }, [answers, id, submitting, result, refreshUser])


  useEffect(() => {
    if (!assessment || result) return


    if (secondsLeft <= 0) {
      handleSubmit()
      return
    }


    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)


    return () => clearInterval(timer)
  }, [secondsLeft, assessment, result, handleSubmit])


  if (loading) {
    return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading assessment...</div>
  }


  if (error && !assessment) {
    return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>
  }
 
  if(assessment && assessment.questions.length === 0){
    return (
    <div className='px-8 py-8'>
      <div className='bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl p06'>
      <p className='font-semibold'>This assessment currently has no valid questions.</p>
      <p className='text-sm mt-1'>One or more questions it referenced may have been removed. Please contact an or try a different assessment.</p>
      </div>
    </div>
    )
  }

  if (result) {
    return (
      <div className="px-8 py-8">
        {result.xpGained > 0 && (
          <div className="mb-6 bg-gradient-to-r from-[#4648D4] to-[#6063ee] text-white rounded-xl p-5">
            <p className="font-semibold">+{result.xpGained} XP earned! Now Level {result.newLevel} ({result.newXp} XP total)</p>
            {result.newlyUnlockedAchievements?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {result.newlyUnlockedAchievements.map((a, i) => (
                  <div key={i} className="bg-white/15 rounded-lg px-3 py-2 text-sm">
                    <p className="font-medium">🏆 {a.title}</p>
                    <p className="text-white/80 text-xs">{a.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <ResultReview
          title={result.assessmentTitle}
          score={result.score}
          correctCount={result.correctCount}
          totalQuestions={result.totalQuestions}
          passed={result.passed}
          passingScore={result.passingScore}
          results={result.results}
        />
      </div>
    )
  }


  const questions = assessment.questions
  const currentQuestion = questions[currentIndex]
  const total = questions.length


  const isAnswered = (qId) => answers[qId] !== undefined
  const isMarked = (qId) => markedForReview.has(qId)


  const toggleMarked = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev)
      if (next.has(currentQuestion._id)) next.delete(currentQuestion._id)
      else next.add(currentQuestion._id)
      return next
    })
  }


  const selectAnswer = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion._id]: optionIndex }))
    if (error) setError('')
  }


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-[#c7c4d7]/20 dark:border-white/10 bg-[#f8f9fa]/80 dark:bg-[#111112]/80 backdrop-blur-md px-8 py-5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {assessment.title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-semibold text-[#4648D4] dark:text-[#8b8dfa]">
              Question {currentIndex + 1} of {total}
            </span>
            <div className="w-48 h-2 bg-[#e7e8e9] dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4648D4] rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>


        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            {formatTime(secondsLeft)}
          </div>
          <button
            onClick={() => {
              if (confirm('End the test now? Your current answers will be submitted.')) {
                handleSubmit()
              }
            }}
            className="border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 text-xs font-semibold px-5 py-2 rounded-lg"
          >
            End Test
          </button>
        </div>
      </div>


      {error && (
        <div className="mx-6 mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}


      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <aside className="w-[280px] bg-white/70 dark:bg-[#1a1b23] border border-white/50 dark:border-white/10 rounded-2xl p-6 flex flex-col overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-[#464554] dark:text-gray-400 tracking-wide uppercase">Navigation</span>
            <label className="flex items-center gap-2 text-sm text-[#464554] dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isMarked(currentQuestion._id)}
                onChange={toggleMarked}
                className="w-4 h-4 rounded border-[#C7C4D7] dark:border-white/20"
              />
              Mark for Review
            </label>
          </div>


          <div className="grid grid-cols-5 gap-3 mb-8">
            {questions.map((q, i) => {
              const answered = isAnswered(q._id)
              const marked = isMarked(q._id)
              const isCurrent = i === currentIndex


              let base = 'bg-[#f3f4f5] dark:bg-white/5 border border-[#c7c4d7] dark:border-white/10 text-[#464554] dark:text-gray-300'
              if (marked) base = 'bg-[#59568A] text-white font-bold'
              else if (answered) base = 'bg-[#4648D4] text-white font-bold'


              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(i)}
                  className={`size-10 rounded-full text-sm flex items-center justify-center transition-all ${base} ${
                    isCurrent ? 'ring-2 ring-offset-2 dark:ring-offset-[#1a1b23] ring-[#4648D4]' : ''
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>


          <div className="mt-auto pt-6 border-t border-[#c7c4d7]/20 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-sm text-[#464554] dark:text-gray-300">
              <span className="size-3 rounded-full bg-[#4648D4]" /> Answered
            </div>
            <div className="flex items-center gap-3 text-sm text-[#464554] dark:text-gray-300">
              <span className="size-3 rounded-full bg-[#f3f4f5] dark:bg-white/10 border border-[#c7c4d7] dark:border-white/20" /> Not Answered
            </div>
            <div className="flex items-center gap-3 text-sm text-[#464554] dark:text-gray-300">
              <span className="size-3 rounded-full bg-[#59568A]" /> Marked for Review
            </div>
          </div>
        </aside>


        <section className="flex-1 bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/20 dark:border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-xl font-semibold text-[#191C1D] dark:text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {currentQuestion.questionText}
            </h2>


            <div className="space-y-4 max-w-2xl">
              {currentQuestion.options.map((option, i) => {
                const selected = answers[currentQuestion._id] === i
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      selected
                        ? 'border-2 border-[#4648D4] bg-[#e1e0ff]/10 dark:bg-[#4648D4]/10'
                        : 'border-[#c7c4d7]/50 dark:border-white/10 hover:border-[#4648D4]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      checked={selected}
                      onChange={() => selectAnswer(i)}
                      className="w-5 h-5 accent-[#4648D4]"
                    />
                    <span className={`size-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      selected ? 'bg-[#4648D4] text-white' : 'bg-[#edeeef] dark:bg-white/10 text-[#464554] dark:text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={selected ? 'text-[#4648D4] dark:text-[#8b8dfa] font-medium' : 'text-[#191C1D] dark:text-gray-200'}>
                      {option}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>


          <div className="border-t border-[#c7c4d7]/20 dark:border-white/10 px-6 py-5 flex items-center justify-between shrink-0">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 bg-[#e3e1ed] dark:bg-white/5 text-[#1a1b23] dark:text-gray-200 text-xs font-semibold px-6 py-3 rounded-xl disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>


            {currentIndex === total - 1 ? ( 
              <button
                onClick={() => {
                  if (confirm('Submit your assessment now?')) handleSubmit()
                }}
                disabled={submitting}
                className="bg-[#4648D4] text-white text-xs font-semibold px-6 py-3 rounded-xl disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                className="flex items-center gap-2 bg-[#4648D4] text-white text-xs font-semibold px-6 py-3 rounded-xl"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
