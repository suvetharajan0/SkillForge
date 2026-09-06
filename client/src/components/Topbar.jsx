import { useNavigate } from 'react-router-dom'
import { Search, Menu, Bell, Plus } from 'lucide-react'


export default function Topbar({ onMenuClick, searchQuery, onSearchChange, isAdmin }) {
  const navigate = useNavigate()


  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[260px] h-16 bg-[#f8f9fa]/80 dark:bg-[#111112]/80 backdrop-blur-md border-b border-[#c7c4d7]/20 dark:border-white/10 flex items-center justify-between px-4 lg:px-8 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-[672px]">
        <button onClick={onMenuClick} className="lg:hidden text-[#464554] dark:text-gray-400">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#464554] dark:text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assessments..."
            className="w-full bg-[#e1e3e4]/50 dark:bg-white/5 rounded-full pl-11 pr-4 py-2.5 text-sm text-[#464554] dark:text-gray-200 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
          />
        </div>
      </div>


      <div className="flex items-center gap-6 pl-8">
        {isAdmin && (
          <button
            onClick={() => navigate('/admin/content')}
            className="bg-[#4648D4] text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Assessment</span>
          </button>
        )}
        <button className="relative text-[#464554] dark:text-gray-400">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ba1a1a] border-2 border-[#f8f9fa]" />
        </button>
      </div>
    </header>
  )
}