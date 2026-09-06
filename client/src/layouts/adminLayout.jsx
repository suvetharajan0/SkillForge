import { NavLink, Outlet } from 'react-router-dom'


const TABS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/content', label: 'Content' },
]


export default function AdminLayout() {
  return (
    <div>
      <div className="px-8 pt-8 flex gap-2 border-b border-[#c7c4d7]/30 dark:border-white/10">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                isActive
                  ? 'border-[#4648D4] text-[#4648D4] dark:text-[#8b8dfa]'
                  : 'border-transparent text-[#464554] dark:text-gray-400'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}