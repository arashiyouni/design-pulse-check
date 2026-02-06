import type { SummaryStats } from '@/../product/sections/portfolio-view/types'
import { ArrowUpRight, ArrowDownRight, Minus, Users, Heart, Eye, AlertTriangle } from 'lucide-react'

interface SummaryCardsProps {
  stats: SummaryStats
}

function DeltaChip({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
        <ArrowUpRight className="size-3" />+{delta}
      </span>
    )
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300">
        <ArrowDownRight className="size-3" />{delta}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <Minus className="size-3" />0
    </span>
  )
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Engineers',
      value: stats.totalEngineers,
      delta: stats.totalDelta,
      icon: Users,
      accent: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
    {
      label: 'Healthy',
      value: stats.healthy,
      delta: stats.healthyDelta,
      icon: Heart,
      accent: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400',
    },
    {
      label: 'Monitor',
      value: stats.monitor,
      delta: stats.monitorDelta,
      icon: Eye,
      accent: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    },
    {
      label: 'Needs Attention',
      value: stats.needsAttention,
      delta: stats.needsAttentionDelta,
      icon: AlertTriangle,
      accent: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className={`flex size-8 items-center justify-center rounded-lg ${card.accent}`}>
                <Icon className="size-4" />
              </div>
              <DeltaChip delta={card.delta} />
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </div>
            <div className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {card.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
