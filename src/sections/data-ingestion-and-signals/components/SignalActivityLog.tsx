import { useState } from 'react'
import type { SignalActivity, SignalType } from '@/../product/sections/data-ingestion-and-signals/types'
import { GitPullRequest, MessageSquare, UserCheck, Sparkles } from 'lucide-react'

const typeConfig: Record<SignalType, {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  label: string
}> = {
  delivery: {
    icon: GitPullRequest,
    iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    label: 'Delivery',
  },
  survey: {
    icon: MessageSquare,
    iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300',
    label: 'Survey',
  },
  'check-in': {
    icon: UserCheck,
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
    label: 'Check-In',
  },
  'self-assessment': {
    icon: Sparkles,
    iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300',
    label: 'Self-Assessment',
  },
}

interface SignalActivityLogProps {
  activities: SignalActivity[]
}

export function SignalActivityLog({ activities }: SignalActivityLogProps) {
  const [filter, setFilter] = useState<SignalType | 'all'>('all')

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const filters: { value: SignalType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'survey', label: 'Survey' },
    { value: 'check-in', label: 'Check-In' },
    { value: 'self-assessment', label: 'Self-Assess' },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {filters.map((f) => {
          const count = f.value === 'all' ? activities.length : activities.filter((a) => a.type === f.value).length
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {f.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Activity feed */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-0">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">No activities match this filter</p>
            </div>
          ) : (
            filtered.map((activity) => {
              const config = typeConfig[activity.type]
              const Icon = config.icon

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 rounded-lg px-1 py-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  {/* Icon */}
                  <div className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
                    <Icon className="size-3.5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {activity.engineerName}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.iconBg}`}>
                          {config.label}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(activity.submittedAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {activity.preview}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      by {activity.submittedBy}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
