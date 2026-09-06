import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, BookOpen, LineChart, User,
  Trophy, Award, Bot, Settings, X, ChevronUp, LogOut, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'


const BASE_NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/question-bank', label: 'Question Bank', icon: BookOpen },
  { to: '/performance', label: 'My Performance', icon: LineChart },
  { to: '/skill-profile', label: 'Skill Profile', icon: User },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/ai-coach', label: 'AI Coach', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
]


export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)


  const navItems = user?.role === 'admin'
    ? [...BASE_NAV_ITEMS, { to: '/admin', label: 'Admin Panel', icon: ShieldCheck }]
    : BASE_NAV_ITEMS


  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}


      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-[#f3f4f5] dark:bg-[#1a1b23] border-r border-[#c7c4d7]/30 dark:border-white/10 flex flex-col z-40 transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SkillForge logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-[20px] font-bold text-[#4648D4] dark:text-[#8b8dfa]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              SkillForge
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-[#464554] dark:text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>


        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-[#6063ee] text-white font-semibold'
                    : 'text-[#464554] dark:text-gray-300 hover:bg-[#e3e1ed] dark:hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>


        <div className="border-t border-[#c7c4d7]/30 dark:border-white/10 px-4 py-4 relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 w-full text-left">
            <div className="w-10 h-10 rounded-full bg-[#e3e1ed] dark:bg-[#4648D4]/20 flex items-center justify-center text-[#4648D4] dark:text-[#8b8dfa] font-semibold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#191C1D] dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-[#464554] dark:text-gray-400 truncate">Level {user?.level || 1} • {user?.xp || 0} XP</p>
            </div>
            <ChevronUp className={`w-3 h-3 text-[#464554] dark:text-gray-400 transition-transform shrink-0 ${menuOpen ? '' : 'rotate-180'}`} />
          </button>


          {menuOpen && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
