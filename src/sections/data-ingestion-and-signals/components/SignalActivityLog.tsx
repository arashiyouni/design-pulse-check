import { useState, useMemo } from 'react'
import type { SignalActivity, SignalType, EngineerOption, EngineerLevel } from '@/../product/sections/data-ingestion-and-signals/types'
import { GitPullRequest, MessageSquare, UserCheck, Sparkles, Search, ChevronDown } from 'lucide-react'

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

const levelLabels: Record<EngineerLevel, string> = {
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  staff: 'Staff',
}

interface SignalActivityLogProps {
  activities: SignalActivity[]
  engineers?: EngineerOption[]
}

export function SignalActivityLog({ activities, engineers = [] }: SignalActivityLogProps) {
  const [filter, setFilter] = useState<SignalType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<EngineerLevel | 'all'>('all')

  // Build engineer name → level lookup
  const engineerLevelMap = useMemo(() => {
    const map = new Map<string, EngineerLevel>()
    for (const eng of engineers) {
      map.set(eng.name.toLowerCase(), eng.level)
    }
    return map
  }, [engineers])

  const filtered = useMemo(() => {
    let result = activities

    // Type filter
    if (filter !== 'all') {
      result = result.filter((a) => a.type === filter)
    }

    // Search by engineer name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((a) => a.engineerName.toLowerCase().includes(query))
    }

    // Level filter
    if (levelFilter !== 'all') {
      result = result.filter((a) => {
        const level = engineerLevelMap.get(a.engineerName.toLowerCase())
        return level === levelFilter
      })
    }

    return result
  }, [activities, filter, searchQuery, levelFilter, engineerLevelMap])

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
      {/* Search and level filter row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by engineer name..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <div className="relative">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as EngineerLevel | 'all')}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Levels</option>
            {(Object.keys(levelLabels) as EngineerLevel[]).map((level) => (
              <option key={level} value={level}>{levelLabels[level]}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

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
