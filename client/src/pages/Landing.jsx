import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Code2, ArrowRight, Users, Trophy, Star, Zap, ClipboardList,
  BarChart3, Radar, Bot, Sparkles, MessageSquare, Share2, MessageCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'


const STATS = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: Trophy, value: '50,000+', label: 'Assessments Taken' },
  { icon: Star, value: '90%', label: 'Average Improvement' },
  { icon: Zap, value: '100+', label: 'Skills Covered' },
]


const FEATURES = [
  { icon: ClipboardList, title: 'Smart Assessments', description: 'Take timed assessments across multiple skills and difficulty levels. Instant scoring and detailed analysis.' },
  { icon: BarChart3, title: 'Detailed Analytics', description: 'Track your performance over time with beautiful charts, topic-wise breakdowns, and personalized insights.' },
  { icon: Radar, title: 'Skill Profile', description: 'Visualize your strengths and weaknesses with a dynamic skill profile and track your growth journey.' },
  { icon: Trophy, title: 'Achievements & XP', description: 'Earn XP, unlock achievements, and level up as you progress. Stay motivated and build your streak.' },
  { icon: Users, title: 'Leaderboards', description: 'Compete with developers around the world and climb the leaderboard to showcase your skills.' },
  { icon: Bot, title: 'AI Coach', description: 'Get personalized recommendations, practice questions, and learning paths powered by AI.' },
]


const FOOTER_COLUMNS = [
  { title: 'Quick Links', links: [{ label: 'Home', href: '#home' }, { label: 'Features', href: '#features' }] },
  { title: 'Resources', links: [{ label: 'Documentation', href: '#' }, { label: 'Blog', href: '#' }, { label: 'FAQ', href: '#' }] },
  { title: 'Company', links: [{ label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }, { label: 'Contact Us', href: '#' }] },
]


function Navbar() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  return (
    <header
      className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b border-[#c7c4d7]/30 dark:border-white/10 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-[#111112]/95 shadow-sm' : 'bg-white/80 dark:bg-[#111112]/80'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SkillForge logo" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-2xl font-extrabold text-[#4648D4] dark:text-[#8b8dfa]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            SkillForge
          </span>
        </Link>


        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#home" className="text-[#4648D4] dark:text-[#8b8dfa] border-b-2 border-[#4648D4] dark:border-[#8b8dfa] pb-1">Home</a>
          <a href="#stats" className="text-[#59568A] dark:text-gray-400 hover:text-[#4648D4] dark:hover:text-[#8b8dfa] transition-colors pb-1 border-b-2 border-transparent">About</a>
          <a href="#features" className="text-[#59568A] dark:text-gray-400 hover:text-[#4648D4] dark:hover:text-[#8b8dfa] transition-colors pb-1 border-b-2 border-transparent">Features</a>
        </nav>


        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="bg-[#4648D4] hover:bg-[#4648D4]/90 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden md:block text-sm font-semibold text-[#191C1D] dark:text-white hover:text-[#4648D4] dark:hover:text-[#8b8dfa] transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="bg-[#4648D4] hover:bg-[#4648D4]/90 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


function DashboardPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#4648D4]/20 to-transparent rounded-full blur-3xl scale-150" />
      <div className="bg-white dark:bg-[#1a1b23] rounded-2xl shadow-2xl border border-[#c7c4d7]/30 dark:border-white/10 p-5 rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#191C1D] dark:text-white">Welcome back, Developer 👋</p>
          <div className="w-8 h-8 rounded-full bg-[#e3e1ed] dark:bg-[#4648D4]/20" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[['24', 'Assessments'], ['78%', 'Avg Score'], ['720', 'XP'], ['Lv 7', 'Level']].map(([val, label]) => (
            <div key={label} className="bg-[#f3f4f5] dark:bg-white/5 rounded-lg p-3">
              <p className="text-lg font-bold text-[#4648D4] dark:text-[#8b8dfa]">{val}</p>
              <p className="text-[11px] text-[#59568A] dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
        <div className="h-20 bg-gradient-to-t from-[#4648D4]/10 to-transparent rounded-lg flex items-end gap-1.5 p-2">
          {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 bg-[#4648D4] rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}


function Hero() {
  return (
    <section id="home" className="max-w-[1280px] mx-auto px-5 md:px-20 pt-32 md:pt-40 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#191C1D] dark:text-white leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Test. Track.<br />
              <span className="bg-gradient-to-r from-[#4648D4] to-[#a382f7] bg-clip-text text-transparent">Improve.</span>
            </h1>
            <p className="text-lg text-[#464554] dark:text-gray-400 max-w-lg">
              SkillForge is your all-in-one platform to assess your coding skills, track your progress, and become the developer you aspire to be.
            </p>
          </div>


          <div className="flex flex-wrap gap-4">
            <Link to="/signup" className="bg-[#4648D4] hover:bg-[#4648D4]/90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              Start Free Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="bg-white dark:bg-[#1a1b23] hover:bg-[#f3f4f5] dark:hover:bg-white/5 text-[#4648D4] dark:text-[#8b8dfa] border border-[#c7c4d7] dark:border-white/10 font-semibold px-8 py-4 rounded-lg transition-all">
              Explore Features
            </a>
          </div>


          <div className="flex items-center gap-4 pt-4 border-t border-[#c7c4d7]/50 dark:border-white/10 w-max">
            <div className="flex -space-x-3">
              {['A', 'B', 'C', 'D'].map((letter, i) => (
                <div
                  key={letter}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-[#111112] bg-[#e3e1ed] dark:bg-[#4648D4]/30 flex items-center justify-center text-xs font-bold text-[#4648D4] dark:text-[#8b8dfa]"
                  style={{ zIndex: 4 - i }}
                >
                  {letter}
                </div>
              ))} 
            </div>
            <div className="text-xs text-[#464554] dark:text-gray-400">
              <span className="font-bold text-[#191C1D] dark:text-white">10,000+ developers</span><br />
              already improving with SkillForge
            </div>
          </div>
        </div>


        <DashboardPreview />
      </div>
    </section>
  )
}


function StatsBar() {
  return (
    <section id="stats" className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
      <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-2xl p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4648D4]/10 dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa] shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#191C1D] dark:text-white">{value}</p>
              <p className="text-sm text-[#59568A] dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


function Features() {
  return (
    <section id="features" className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block bg-[#4648D4]/10 dark:bg-[#4648D4]/20 text-[#4648D4] dark:text-[#8b8dfa] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
          Features
        </span>
        <h2 className="text-3xl md:text-[40px] font-bold text-[#191C1D] dark:text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Everything You Need to Grow
        </h2>
        <p className="text-lg text-[#464554] dark:text-gray-400">
          Powerful tools and features designed to help you assess, learn, and master in-demand skills.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/40 dark:border-white/10 rounded-2xl p-8 shadow-sm hover:shadow-md dark:hover:bg-white/[0.03] transition-all duration-300"
          >
            <div className="w-12 h-12 bg-[#4648D4]/10 dark:bg-[#4648D4]/20 rounded-lg flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa] mb-6">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#191C1D] dark:text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {title}
            </h3>
            <p className="text-[#464554] dark:text-gray-400 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}


function CTASection() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 md:px-20 pb-24">
      <div className="bg-[#4648D4]/5 dark:bg-[#4648D4]/10 border border-[#4648D4]/10 dark:border-[#4648D4]/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative shrink-0">
          <div className="w-28 h-28 bg-[#4648D4]/20 dark:bg-[#4648D4]/25 rounded-2xl flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa]">
            <Code2 className="w-14 h-14" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-3 -right-3" />
          <Sparkles className="w-4 h-4 text-yellow-400 absolute -bottom-1 -left-3" />
        </div>


        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-[#191C1D] dark:text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Ready to start your journey?
          </h2>
          <p className="text-[#464554] dark:text-gray-400">
            Join thousands of developers who are already improving their skills with SkillForge.
          </p>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <Link to="/signup" className="bg-[#4648D4] hover:bg-[#4648D4]/90 text-white font-semibold px-8 py-4 rounded-lg shadow-sm transition-all text-center">
            Start Free Now
          </Link>
          <Link to="/login" className="bg-transparent hover:bg-[#4648D4]/5 dark:hover:bg-white/5 text-[#4648D4] dark:text-[#8b8dfa] border border-[#4648D4]/30 dark:border-[#8b8dfa]/30 font-semibold px-8 py-4 rounded-lg transition-all text-center">
            View Assessments
          </Link>
        </div>
      </div>
    </section>
  )
}


function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')


  const handleSubscribe = (e) => {
    e.preventDefault()
    // Note: no newsletter backend exists — this is a decorative confirmation only
    setSubscribed(true)
    setEmail('')
  }


  return (
    <footer className="bg-[#0D1136] dark:bg-[#06081a] w-full pt-16 pb-8 text-white">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20 grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4648D4] rounded flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SkillForge</span>
          </div>
          <p className="text-white/70 text-sm max-w-xs">
            The all-in-one platform to test, track, and improve your developer skills.
          </p>
          <div className="flex gap-3">
            {[Code2, MessageSquare, MessageCircle, Share2].map((Icon, i) => (
              <a key={i} href="#" className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>


        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="font-bold text-sm mb-1">{col.title}</h4>
            {col.links.map((link) => (
              <a key={link.label} href={link.href} className="text-white/70 hover:text-white hover:underline decoration-[#4648D4] underline-offset-4 text-sm w-fit transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        ))}


        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm mb-1">Stay Updated</h4>
          <p className="text-white/70 text-sm">Subscribe for tips, updates, and more.</p>
          {subscribed ? (
            <p className="text-sm text-green-400 font-medium">Thanks — you're on the list!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 rounded-l-lg py-3 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#4648D4] w-full"
              />
              <button type="submit" aria-label="Subscribe" className="bg-[#4648D4] hover:bg-[#4648D4]/90 p-3 rounded-r-lg h-[44px] w-[44px] flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>


      <div className="max-w-[1280px] mx-auto px-5 md:px-20 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
        <p className="text-white/50 text-sm">© 2026 SkillForge. All rights reserved.</p>
        <p className="text-white/50 text-sm">Made with ♥ for developers</p>
      </div>
    </footer>
  )
}


export default function Landing() {
  return (
    <div className="bg-[#f8f9ff] dark:bg-[#111112] text-[#191C1D] dark:text-white min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}