import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)


  const { login } = useAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen flex">
      {/* Left panel - hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-[#f3f4f5] dark:bg-[#1a1b23] p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bg-[#6063ee] blur-[60px] h-[400px] w-[300px] rounded-full -left-16 -top-20" />
          <div className="absolute bg-[#726fa4] blur-[70px] h-[450px] w-[350px] rounded-full -right-16 bottom-10" />
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-[28px] font-bold text-[#191C1D] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Elevate your engineering potential.
          </h2>
          <p className="text-[16px] text-[#464554] dark:text-gray-400 mt-4 leading-relaxed">
            Join thousands of developers assessing and improving their skills with data-driven insights.
          </p>
        </div>
      </div>


      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa] dark:bg-[#111112] px-8">
        <div className="w-full max-w-[448px]">
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="SkillForge logo" className="w-10 h-10 rounded-md object-cover" />
            <span className="text-[20px] font-bold text-[#4648D4] dark:text-[#8b8dfa]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              SkillForge
            </span>
          </div>


          <h1 className="text-[36px] font-bold text-[#191C1D] dark:text-white tracking-tight mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-[16px] text-[#464554] dark:text-gray-400 mb-8">
            Log in to continue your developer journey.
          </p>


          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-[12px] font-semibold text-[#191C1D] dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="developer@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>


            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="text-[12px] font-semibold text-[#191C1D] dark:text-white">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[12px] font-semibold text-[#4648D4] dark:text-[#8b8dfa]">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-[#C7C4D7] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#1a1b23] text-[#191C1D] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
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
              {submitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>


          <p className="text-center text-sm text-[#464554] dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#4648D4] dark:text-[#8b8dfa] font-semibold text-[12px]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}