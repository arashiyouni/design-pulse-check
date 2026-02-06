import { useState } from 'react'
import type { TrendGroup, TrendDirection } from '@/../product/sections/portfolio-view/types'
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const trendConfig: Record<TrendDirection, {
  icon: React.ComponentType<{ className?: string }>
  accent: string
  badge: string
}> = {
  declining: {
    icon: TrendingDown,
    accent: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
  },
  stable: {
    icon: Minus,
    accent: 'text-slate-600 dark:text-slate-400',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
  improving: {
    icon: TrendingUp,
    accent: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300',
  },
}

const statusBadge: Record<string, string> = {
  healthy: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300',
  monitor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  attention: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
}

interface TrendGroupsProps {
  groups: TrendGroup[]
  onEngineerClick?: (id: string) => void
}

export function TrendGroups({ groups, onEngineerClick }: TrendGroupsProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    declining: true,
    stable: false,
    improving: false,
  })

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const config = trendConfig[group.trend]
        const Icon = config.icon
        const isOpen = expanded[group.trend] ?? false

        return (
          <div key={group.trend} className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [group.trend]: !prev[group.trend] }))}
              className="flex w-full items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`size-4 ${config.accent}`} />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{group.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.badge}`}>
                  {group.count}
                </span>
              </div>
              <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && group.engineers.length > 0 && (
              <div className="border-t border-slate-100 px-5 pb-3 dark:border-slate-800">
                {group.engineers.map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => onEngineerClick?.(eng.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {eng.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{eng.name}</span>
                        <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">{eng.project}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{eng.compositeScore}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[eng.attentionStatus]}`}>
                        {eng.attentionStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
