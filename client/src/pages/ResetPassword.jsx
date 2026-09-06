import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'


function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}


export default function ResetPassword() {
  const { userId, token } = useParams()
  const navigate = useNavigate()
  const { setUser } = useAuth()


  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const strength = getPasswordStrength(password)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')


    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }


    setSubmitting(true)
    try {
      const res = await api.put(`/auth/reset-password/${userId}/${token}`, { password })
      localStorage.setItem('token', res.data.token)
      const me = await api.get('/auth/me')
      setUser(me.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed — the link may be invalid or expired')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-[#f3f4f5] dark:bg-[#1a1b23] p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bg-[#4648D4]/10 blur-[60px] rounded-full size-[420px] left-1/3 top-1/4" />
        </div>
        <div className="relative z-10 max-w-md flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-xl bg-[#f8f9fa] dark:bg-white/5 border border-[#c7c4d7]/30 dark:border-white/10 shadow-lg dark:shadow-none flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-[#4648D4] dark:text-[#8b8dfa]" aria-hidden="true" />
          </div>
          <h2 className="text-[28px] font-bold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Secure your SkillForge account
          </h2>
          <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-4 leading-relaxed">
            Update your password to regain access to your developer assessments, skill profiles, and personalized AI coaching.
          </p>
        </div>
      </div>


      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] dark:bg-[#111112] px-8">
        <div className="w-full max-w-[448px]">
          <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Create new password
          </h1>
          <p className="text-[14px] text-[#464554] dark:text-gray-400 mb-8">
            Your new password must be different from previous passwords.
          </p>


          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label htmlFor="reset-password" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2 mt-2" role="progressbar" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4} aria-label="Password strength">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < strength
                        ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-yellow-400' : 'bg-green-500'
                        : 'bg-[#e3e1ed] dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[12px] text-[#767586] dark:text-gray-400 font-semibold mt-1">
                Must be at least 6 characters
              </p>
            </div>


            <div>
              <label htmlFor="reset-confirm-password" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="reset-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>


            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2" role="alert">
                {error}
              </p>
            )}


            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4648D4] text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-60"
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>


            <Link to="/login" className="flex items-center justify-center gap-1 text-[12px] font-semibold text-[#4648D4] dark:text-[#8b8dfa]">
              <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}