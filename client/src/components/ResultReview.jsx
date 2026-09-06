import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'


export default function ResultReview({
  title,
  score,
  correctCount,
  totalQuestions,
  passed,
  passingScore,
  results,
  backLink = '/assessments',
  backLabel = '← Back to Assessments',
}) {
  return (
    <div className="max-w-4xl">
      <div className={`rounded-2xl p-8 mb-8 text-center ${
        passed
          ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
          : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20'
      }`}>
        <p className="text-sm font-semibold text-[#464554] dark:text-gray-400 uppercase tracking-wide mb-2">{title}</p>
        <p className={`text-5xl font-bold mb-2 ${passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{score}%</p>
        <p className="text-[#464554] dark:text-gray-400">
          {correctCount} / {totalQuestions} correct — {passed ? 'Passed' : 'Not Passed'} (passing score: {passingScore}%)
        </p>
      </div>


      <h2 className="text-lg font-bold text-[#191C1D] dark:text-white mb-4">Review</h2>
      <div className="space-y-4">
        {results.map((r, i) => (
          <div key={r.questionId} className="border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-[#1a1b23]">
            <div className="flex items-start gap-3 mb-3">
              {r.isCorrect
                ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />}
              <p className="font-medium text-[#191C1D] dark:text-white">{i + 1}. {r.questionText}</p>
            </div>
            <div className="ml-8 space-y-1 text-sm">
              {r.options.map((opt, oi) => (
                <p
                  key={oi}
                  className={
                    oi === r.correctIndex
                      ? 'text-green-700 dark:text-green-400 font-medium'
                      : oi === r.selectedIndex
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-[#464554] dark:text-gray-400'
                  }
                >
                  {String.fromCharCode(65 + oi)}. {opt}
                  {oi === r.correctIndex && ' ✓ correct answer'}
                  {oi === r.selectedIndex && oi !== r.correctIndex && ' — your answer'}
                </p>
              ))}
            </div>
            {r.explanation && (
              <p className="ml-8 mt-3 text-sm text-[#464554] dark:text-gray-300 bg-[#f3f4f5] dark:bg-white/5 rounded-lg p-3">
                {r.explanation}
              </p>
            )}
          </div>
        ))}
      </div>


      <Link to={backLink} className="inline-block mt-8 text-[#4648D4] dark:text-[#8b8dfa] font-semibold text-sm">
        {backLabel}
      </Link>
    </div>
  )
}
