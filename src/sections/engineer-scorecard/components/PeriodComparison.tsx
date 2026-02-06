import type { PeriodComparison as PeriodComparisonType } from '@/../product/sections/engineer-scorecard/types'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface PeriodComparisonProps {
  comparison: PeriodComparisonType
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-teal-600 dark:text-teal-400">
        <ArrowUpRight className="size-3" />
        +{delta.toFixed(1)}%
      </span>
    )
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-red-600 dark:text-red-400">
        <ArrowDownRight className="size-3" />
        {delta.toFixed(1)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
      <Minus className="size-3" />
      0.0%
    </span>
  )
}

export function PeriodComparison({ comparison }: PeriodComparisonProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Period Comparison</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {comparison.previousPeriod} &rarr; {comparison.currentPeriod}
        </span>
      </div>

      {/* Composite score comparison */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Composite Score</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-slate-400 dark:text-slate-500">{comparison.previousScore}</span>
            <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">{comparison.currentScore}</span>
          </div>
        </div>
        <DeltaBadge delta={comparison.delta} />
      </div>

      {/* Pillar deltas */}
      <div className="space-y-2">
        {comparison.pillarDeltas.map((pd) => (
          <div key={pd.pillarName} className="flex items-center justify-between py-1.5">
            <span className="text-sm text-slate-600 dark:text-slate-400">{pd.pillarName}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1.5 text-right">
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{pd.previous}</span>
                <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{pd.current}</span>
              </div>
              <DeltaBadge delta={pd.delta} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
