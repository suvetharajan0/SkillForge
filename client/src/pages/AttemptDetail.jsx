import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import ResultReview from '../components/ResultReview'


export default function AttemptDetail() {
  const { id } = useParams()
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    api
      .get(`/attempts/${id}`)
      .then((res) => setAttempt(res.data))
      .catch(() => setError('Could not load this result'))
      .finally(() => setLoading(false))
  }, [id])


  if (loading) return <div className="px-8 py-8 text-[#464554] dark:text-gray-400">Loading...</div>
  if (error) return <div className="px-8 py-8 text-red-600 dark:text-red-400">{error}</div>


  const results = attempt.answers.map((a) => ({
    questionId: a.question._id,
    questionText: a.question.questionText,
    options: a.question.options,
    selectedIndex: a.selectedIndex,
    correctIndex: a.correctIndex,
    isCorrect: a.isCorrect,
    explanation: a.question.explanation,
  }))


  return (
    <div className="px-8 py-8">
      <ResultReview
        title={attempt.assessment.title}
        score={attempt.score}
        correctCount={attempt.correctCount}
        totalQuestions={attempt.totalQuestions}
        passed={attempt.passed}
        passingScore={attempt.assessment.passingScore}
        results={results}
        backLink="/performance"
        backLabel="← Back to My Performance"
      />
    </div>
  )
}
