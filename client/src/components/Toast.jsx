import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'


const STYLES = {
  success: { bg: 'bg-green-50 dark:bg-green-500/10', border: 'border-green-200 dark:border-green-500/20', text: 'text-green-800 dark:text-green-400', icon: CheckCircle2 },
  error: { bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', text: 'text-red-800 dark:text-red-400', icon: XCircle },
  info: { bg: 'bg-[#e3e1ed] dark:bg-[#4648D4]/10', border: 'border-[#4648D4]/20 dark:border-[#4648D4]/20', text: 'text-[#4648D4] dark:text-[#8b8dfa]', icon: Info },
}


export default function ToastContainer() {
  const { toasts, removeToast } = useToast()


  if (toasts.length === 0) return null


  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" role="region" aria-label="Notifications">
      {toasts.map((t) => {
        const style = STYLES[t.type] || STYLES.info
        const Icon = style.icon
        return (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 border rounded-lg px-4 py-3 shadow-lg ${style.bg} ${style.border} ${style.text}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm flex-1">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="shrink-0" aria-label="Dismiss notification">
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}