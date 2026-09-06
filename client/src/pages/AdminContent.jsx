
import { useState, useEffect } from 'react'
import api from '../api/axios'
import {useToast} from '../context/ToastContext'

// ---------- Skills Tab ----------
function SkillsTab() {
   const { toast } = useToast()
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState({ name: '', category: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')


  const load = () => api.get('/skills').then((res) => setSkills(res.data))
  useEffect(() => { load() }, [])


  const resetForm = () => {
    setForm({ name: '', category: '', description: '' })
    setEditingId(null)
    setError('')
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
 try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, form)
        toast.success('Skill updated')
      } else {
        await api.post('/skills', form)
        toast.success('Skill created')
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save skill')
    }
  }


  const startEdit = (s) => {
    setForm({ name: s.name, category: s.category, description: s.description || '' })
    setEditingId(s._id)
    setError('')
  }


 const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    try {
      await api.delete(`/skills/${id}`)
      toast.info('Skill deleted')
      if (editingId === id) resetForm()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete skill')
    }
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-5 space-y-3 h-fit">
        <h3 className="font-semibold text-[#191C1D] dark:text-white">{editingId ? 'Edit Skill' : 'New Skill'}</h3>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        <input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#4648D4] text-white text-sm font-medium py-2 rounded-lg">
            {editingId ? 'Save Changes' : 'Add Skill'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 border border-[#C7C4D7] text-[#464554] text-sm font-medium py-2 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>


      <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10">
        {skills.map((s) => (
          <div key={s._id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-medium text-[#191C1D] dark:text-white text-sm">{s.name}</p>
              <p className="text-xs text-[#464554] dark:text-gray-400">{s.category}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(s)} className="text-[#4648D4] text-xs font-semibold">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="text-red-600 text-xs font-semibold">Delete</button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="p-5 text-sm text-[#464554]">No skills yet.</p>}
      </div>
    </div>
  )
}


// ---------- Questions Tab ----------
function QuestionsTab() {
  const { toast } = useToast()
  const [questions, setQuestions] = useState([])
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState({
    skill: '', questionText: '', optionsText: '', correctAnswerIndex: 0, difficulty: 'medium', explanation: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')


  const load = () => api.get('/questions').then((res) => setQuestions(res.data))
  useEffect(() => {
    load()
    api.get('/skills').then((res) => setSkills(res.data))
  }, [])


  const resetForm = () => {
    setForm({ skill: '', questionText: '', optionsText: '', correctAnswerIndex: 0, difficulty: 'medium', explanation: '' })
    setEditingId(null)
    setError('')
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const options = form.optionsText.split('\n').map((o) => o.trim()).filter(Boolean)
    if (options.length < 2) {
      setError('Provide at least 2 options, one per line')
      return
    }


    const payload = {
      skill: form.skill,
      questionText: form.questionText,
      options,
      correctAnswerIndex: Number(form.correctAnswerIndex),
      difficulty: form.difficulty,
      explanation: form.explanation,
    }


    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, payload)
      } else {
        await api.post('/questions', payload)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save question')
    }
  }


  const startEdit = (q) => {
    setForm({
      skill: q.skill?._id || '',
      questionText: q.questionText,
      optionsText: q.options.join('\n'),
      correctAnswerIndex: q.correctAnswerIndex,
      difficulty: q.difficulty,
      explanation: q.explanation || '',
    })
    setEditingId(q._id)
    setError('')
  }


  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return
    try {
      await api.delete(`/questions/${id}`)
      toast.info('Question deleted')
      if (editingId === id) resetForm()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete question')
    }
  }


  const optionLines = form.optionsText.split('\n').map((o) => o.trim()).filter(Boolean)


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-5 space-y-3 h-fit">
        <h3 className="font-semibold text-[#191C1D] dark:text-white">{editingId ? 'Edit Question' : 'New Question'}</h3>
        <select required value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white">
          <option value="">Select skill...</option>
          {skills.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <textarea required placeholder="Question text" value={form.questionText}
          onChange={(e) => setForm({ ...form, questionText: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        <textarea required placeholder={'Options, one per line\ne.g.\nuseState\nuseEffect'} rows={4}
          value={form.optionsText} onChange={(e) => setForm({ ...form, optionsText: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        {optionLines.length > 0 && (
          <div>
            <label className="text-xs font-medium text-[#464554] dark:text-gray-400">Correct answer:</label>
            <select value={form.correctAnswerIndex} onChange={(e) => setForm({ ...form, correctAnswerIndex: e.target.value })}
              className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white mt-1">
              {optionLines.map((opt, i) => <option key={i} value={i}>{String.fromCharCode(65 + i)}. {opt}</option>)}
            </select>
          </div>
        )}
        <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <textarea placeholder="Explanation (optional)" value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#4648D4] text-white text-sm font-medium py-2 rounded-lg">
            {editingId ? 'Save Changes' : 'Add Question'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 border border-[#C7C4D7] dark:border-white/10 text-[#464554] dark:text-gray-300 text-sm font-medium py-2 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>


      <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl divide-y divide-[#c7c4d7]/20 dark:divide-white/10 max-h-[600px] overflow-y-auto">
        {questions.map((q) => (
          <div key={q._id} className="flex items-center justify-between px-5 py-3 gap-4">
            <div className="min-w-0">
              <p className="font-medium text-[#191C1D] dark:text-white text-sm truncate">{q.questionText}</p>
              <p className="text-xs mt-0.5">
                {q.skill?.name ? (
                  <span className="text-[#464554] dark:text-gray-400">{q.skill.name} · {q.difficulty}</span>
                ) : (
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">⚠ Missing skill · {q.difficulty}</span>
                )}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => startEdit(q)} className="text-[#4648D4] dark:text-[#8b8dfa] text-xs font-semibold">Edit</button>
              <button onClick={() => handleDelete(q._id)} className="text-red-600 dark:text-red-400 text-xs font-semibold">Delete</button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p className="p-5 text-sm text-[#464554] dark:text-gray-400">No questions yet.</p>}
      </div>
    </div>
  )
}


// ---------- Assessments Tab ----------
function AssessmentsTab() {
  const { toast } = useToast()
  const [assessments, setAssessments] = useState([])
  const [skills, setSkills] = useState([])
  const [allQuestions, setAllQuestions] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', skill: '', questionIds: [], difficulty: 'mixed', timeLimit: 15, passingScore: 70,
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')


  const load = () => api.get('/assessments').then((res) => setAssessments(res.data))
  useEffect(() => {
    load()
    api.get('/skills').then((res) => setSkills(res.data))
    api.get('/questions').then((res) => setAllQuestions(res.data))
  }, [])


  const filteredQuestions = allQuestions.filter((q) => q.skill?._id === form.skill)


  const resetForm = () => {
    setForm({ title: '', description: '', skill: '', questionIds: [], difficulty: 'mixed', timeLimit: 15, passingScore: 70 })
    setEditingId(null)
    setError('')
  }


  const toggleQuestion = (id) => {
    setForm((prev) => ({
      ...prev,
      questionIds: prev.questionIds.includes(id)
        ? prev.questionIds.filter((q) => q !== id)
        : [...prev.questionIds, id],
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.questionIds.length === 0) {
      setError('Select at least one question')
      return
    }


    const payload = {
      title: form.title,
      description: form.description,
      skill: form.skill,
      questions: form.questionIds,
      difficulty: form.difficulty,
      timeLimit: Number(form.timeLimit),
      passingScore: Number(form.passingScore),
    }


    try {
      if (editingId) {
        await api.put(`/assessments/${editingId}`, payload)
      } else {
        await api.post('/assessments', payload)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save assessment')
    }
  }


  const startEdit = async (a) => {
    setError('')
    try {
      // Full assessment detail includes fully populated question objects; we just need their IDs
      const res = await api.get(`/assessments/${a._id}`)
      const full = res.data
      setForm({
        title: full.title,
        description: full.description || '',
        skill: full.skill?._id || '',
        questionIds: full.questions.map((q) => q._id),
        difficulty: full.difficulty,
        timeLimit: full.timeLimit,
        passingScore: full.passingScore,
      })
      setEditingId(a._id)
    } catch (err) {
      setError('Could not load assessment for editing')
    }
  }


 const handleDelete = async (id) => {
    if (!confirm('Delete this assessment?')) return
    try {
      await api.delete(`/assessments/${id}`)
      toast.info('Assessment deleted')
      if (editingId === id) resetForm()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete assessment')
    }
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-5 space-y-3 h-fit">
        <h3 className="font-semibold text-[#191C1D] dark:text-white">{editingId ? 'Edit Assessment' : 'New Assessment'}</h3>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        <select required value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value, questionIds: [] })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white">
          <option value="">Select primary skill...</option>
          {skills.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>


        {form.skill && (
          <div>
            <label className="text-xs font-medium text-[#464554] dark:text-gray-400">Questions ({form.questionIds.length} selected):</label>
            <div className="border border-[#C7C4D7] dark:border-white/10 rounded-lg mt-1 max-h-40 overflow-y-auto p-2 space-y-1">
              {filteredQuestions.length === 0 && <p className="text-xs text-[#464554] dark:text-gray-400 p-2">No questions for this skill yet — add some in the Questions tab first.</p>}
              {filteredQuestions.map((q) => (
                <label key={q._id} className="flex items-start gap-2 text-xs p-1 text-[#191C1D] dark:text-gray-200">
                  <input type="checkbox" checked={form.questionIds.includes(q._id)} onChange={() => toggleQuestion(q._id)} className="mt-0.5" />
                  {q.questionText}
                </label>
              ))}
            </div>
          </div>
        )}


        <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="mixed">Mixed</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input required type="number" min="1" placeholder="Time (min)" value={form.timeLimit}
            onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
            className="border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
          <input required type="number" min="0" max="100" placeholder="Passing %" value={form.passingScore}
            onChange={(e) => setForm({ ...form, passingScore: e.target.value })}
            className="border border-[#C7C4D7] dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#111112] text-[#191C1D] dark:text-white" />
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#4648D4] text-white text-sm font-medium py-2 rounded-lg">
            {editingId ? 'Save Changes' : 'Create Assessment'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 border border-[#C7C4D7] dark:border-white/10 text-[#464554] dark:text-gray-300 text-sm font-medium py-2 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>


      <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl divide-y divide-[#c7c4d7]/20 dark:divide-white/10">
        {assessments.map((a) => (
          <div key={a._id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-medium text-[#191C1D] dark:text-white text-sm">{a.title}</p>
              <p className="text-xs mt-0.5">
                {a.skill?.name ? (
                  <span className="text-[#464554] dark:text-gray-400">{a.skill.name} · {a.questionCount} questions · {a.timeLimit} min</span>
                ) : (
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">⚠ Missing skill · {a.questionCount} questions</span>
                )}
                {a.questionCount === 0 && (
                  <span className="text-red-600 dark:text-red-400 font-semibold"> · ⚠ No valid questions</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(a)} className="text-[#4648D4] dark:text-[#8b8dfa] text-xs font-semibold">Edit</button>
              <button onClick={() => handleDelete(a._id)} className="text-red-600 dark:text-red-400 text-xs font-semibold">Delete</button>
            </div>
          </div>
        ))}
        {assessments.length === 0 && <p className="p-5 text-sm text-[#464554] dark:text-gray-400">No assessments yet.</p>}
      </div>
    </div>
  )
}


// ---------- Main page with tabs ----------
export default function AdminContent() {
  const [tab, setTab] = useState('skills')


  const tabs = [
    { key: 'skills', label: 'Skills' },
    { key: 'questions', label: 'Questions' },
    { key: 'assessments', label: 'Assessments' },
  ]


  return (
    <div className="px-8 py-8">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Content Management
      </h1>


      <div className="flex gap-2 mb-6 border-b border-[#c7c4d7]/30">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.key ? 'border-[#4648D4] text-[#4648D4]' : 'border-transparent text-[#464554]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>


      {tab === 'skills' && <SkillsTab />}
      {tab === 'questions' && <QuestionsTab />}
      {tab === 'assessments' && <AssessmentsTab />}
    </div>
  )
}