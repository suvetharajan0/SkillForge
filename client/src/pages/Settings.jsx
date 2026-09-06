import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'


const OPTIONS = [
  { value: 'light', label: 'Light', description: 'Always use light mode', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Always use dark mode', icon: Moon },
  { value: 'system', label: 'System', description: 'Match your device setting', icon: Monitor },
]


export default function Settings() {
  const { theme, setTheme } = useTheme()


  return (
    <div className="px-8 py-8 max-w-2xl">
      <h1 className="text-[28px] font-bold text-[#191C1D] dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Settings
      </h1>
      <p className="text-[#464554] dark:text-gray-400 mb-8">Manage your preferences.</p>


      <div className="bg-white dark:bg-[#1a1b23] border border-[#c7c4d7]/30 dark:border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#191C1D] dark:text-white mb-1">Appearance</h2>
        <p className="text-sm text-[#464554] dark:text-gray-400 mb-6">Choose how SkillForge looks to you.</p>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OPTIONS.map(({ value, label, description, icon: Icon }) => {
            const isActive = theme === value
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`relative text-left border rounded-xl p-4 transition-colors ${
                  isActive
                    ? 'border-[#4648D4] bg-[#4648D4]/5 dark:bg-[#4648D4]/10'
                    : 'border-[#c7c4d7]/40 dark:border-white/10 hover:border-[#4648D4]/40'
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#4648D4] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                <Icon className={`w-5 h-5 mb-3 ${isActive ? 'text-[#4648D4]' : 'text-[#464554] dark:text-gray-400'}`} />
                <p className="font-medium text-[#191C1D] dark:text-white text-sm">{label}</p>
                <p className="text-xs text-[#464554] dark:text-gray-400 mt-1">{description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}