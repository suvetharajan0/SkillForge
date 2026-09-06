import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Code2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'


const TECH_STACKS = [
  'MERN (MongoDB, Express, React, Node)',
  'MEAN (MongoDB, Express, Angular, Node)',
  'Python / Django',
  'Java / Spring',
  '.NET / C#',
  'Other',
]


function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}


export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [techStack, setTechStack] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const { register } = useAuth()
  const navigate = useNavigate()


  const strength = getPasswordStrength(password)


  const clearError = () => {
    if (error) setError('')
  }


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
      await register(name, email, password, techStack)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-[#f3f4f5] dark:bg-[#1a1b23] p-12 border-r border-[#c7c4d7]/30 dark:border-white/10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute bg-[#4648D4]/10 blur-[60px] rounded-full size-[500px] -left-20 -top-40" />
          <div className="absolute bg-[#59568a]/10 blur-[60px] rounded-full size-[420px] -right-24 bottom-20" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="SkillForge logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-[28px] font-bold text-[#4648D4] dark:text-[#8b8dfa] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              SkillForge
            </span>
          </div>
          <h2 className="text-[36px] font-bold text-[#191C1D] dark:text-white tracking-tight leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Join the community of top-tier developers.
          </h2>
          <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-4 leading-relaxed">
            Elevate your technical prowess. Access advanced skill assessments, dynamic question banks, and personalized AI coaching to accelerate your engineering career.
          </p>
        </div>
      </div>


      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] dark:bg-[#111112] px-8 py-12">
        <div className="w-full max-w-[448px]">
          <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Create your account
          </h1>
          <p className="text-[14px] text-[#464554] dark:text-gray-400 mb-8">
            Start your journey to engineering excellence today.
          </p>


          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label htmlFor="signup-name" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError() }}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>


            <div>
              <label htmlFor="signup-email" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError() }}
                  placeholder="jane@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>


            <div>
              <label htmlFor="signup-techstack" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                Primary Tech Stack
              </label>
              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <select
                  id="signup-techstack"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm text-[#191C1D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4648D4] appearance-none bg-white dark:bg-[#1a1b23]"
                >
                  <option value="">Select your primary stack...</option>
                  {TECH_STACKS.map((stack) => (
                    <option key={stack} value={stack}>{stack}</option>
                  ))}
                </select>
              </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-password" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError() }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-9 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
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
                <div className="flex gap-1 mt-2" role="progressbar" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4} aria-label="Password strength">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < strength
                          ? strength <= 1
                            ? 'bg-red-400'
                            : strength <= 2
                            ? 'bg-yellow-400'
                            : 'bg-green-500'
                          : 'bg-[#e1e3e4] dark:bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-[#464554]/70 dark:text-gray-500 mt-1 text-right">
                  Must be at least 6 characters
                </p>
              </div>


              <div>
                <label htmlFor="signup-confirm-password" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError() }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                  />
                </div>
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
              className="w-full bg-[#4648D4] text-white text-[12px] font-semibold py-3 rounded-lg disabled:opacity-60"
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>


          <p className="text-center text-sm text-[#464554] dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4648D4] dark:text-[#8b8dfa] font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}