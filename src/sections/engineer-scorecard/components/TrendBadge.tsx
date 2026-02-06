import type { TrendDirection } from '@/../product/sections/engineer-scorecard/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const trendConfig: Record<TrendDirection, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  classes: string
}> = {
  improving: {
    label: 'Improving',
    icon: TrendingUp,
    classes: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
  },
  stable: {
    label: 'Stable',
    icon: Minus,
    classes: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  },
  declining: {
    label: 'Declining',
    icon: TrendingDown,
    classes: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
  },
}

interface TrendBadgeProps {
  trend: TrendDirection
  compact?: boolean
}

export function TrendBadge({ trend, compact = false }: TrendBadgeProps) {
  const config = trendConfig[trend]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.classes}`}>
      <Icon className="size-3" />
      {!compact && config.label}
    </span>
  )
}
