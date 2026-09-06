import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import api from '../api/axios'
import logo from '../assets/logo.png'


export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#111112] px-8">
      <div className="w-full max-w-[448px]">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="SkillForge logo" className="w-14 h-14 rounded-xl object-cover mb-4" />
          <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Forgot your password?
          </h1>
          <p className="text-[14px] text-[#464554] dark:text-gray-400 mt-2">
            Enter your email and we'll send you a link to reset it.
          </p>
        </div>


        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="forgot-email" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); setMessage('') }}
                placeholder="developer@example.com"
                className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
              />
            </div>
          </div>


          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2" role="alert">
              {error}
            </p>
          )}


          {message && (
            <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg px-3 py-2" role="status">
              {message}
            </p>
          )}


          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#4648D4] text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>


        <Link to="/login" className="flex items-center justify-center gap-1 text-[12px] font-semibold text-[#4648D4] dark:text-[#8b8dfa] mt-6">
          <ArrowLeft className="w-3 h-3" aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </div>
  )
}