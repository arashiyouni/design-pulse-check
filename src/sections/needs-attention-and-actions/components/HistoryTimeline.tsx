import type { TimelineEntry } from '@/../product/sections/needs-attention-and-actions/types'
import { AlertTriangle, Eye, Plus, CheckCircle2, RefreshCw } from 'lucide-react'

const entryConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
}> = {
  'alert-triggered': {
    icon: AlertTriangle,
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
  'action-created': {
    icon: Plus,
    iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300',
  },
  'action-completed': {
    icon: CheckCircle2,
    iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300',
  },
  'status-change': {
    icon: RefreshCw,
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
  },
}

interface HistoryTimelineProps {
  entries: TimelineEntry[]
}

export function HistoryTimeline({ entries }: HistoryTimelineProps) {
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

      <div className="space-y-0">
        {entries.map((entry) => {
          const config = entryConfig[entry.type] || entryConfig['status-change']
          const Icon = config.icon

          // Override icon for monitor-severity alerts
          const finalIconBg = entry.type === 'alert-triggered' && entry.severity === 'monitor'
            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
            : config.iconBg

          const FinalIcon = entry.type === 'alert-triggered' && entry.severity === 'monitor' ? Eye : Icon

          return (
            <div
              key={entry.id}
              className="relative flex gap-4 rounded-lg px-1 py-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              {/* Icon */}
              <div className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${finalIconBg}`}>
                <FinalIcon className="size-3.5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {entry.title}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {entry.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
