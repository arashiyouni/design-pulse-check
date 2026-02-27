import type {
  ActionEffectiveness,
  ActionItem,
  EffectivenessVerdict,
} from '@/../product/sections/needs-attention-and-actions/types'
import { TrendingUp, ChevronRight } from 'lucide-react'

const verdictConfig: Record<
  EffectivenessVerdict,
  { badge: string; label: string }
> = {
  resolved: {
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    label: 'Resolved',
  },
  monitoring: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    label: 'Monitoring',
  },
  escalated: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    label: 'Escalated',
  },
}

interface AggregateStatProps {
  value: string
  label: string
  sub: string
  colorClass: string
  borderClass: string
  bgClass: string
}

function AggregateStat({ value, label, sub, colorClass, borderClass, bgClass }: AggregateStatProps) {
  return (
    <div className={`rounded-xl border p-3 ${bgClass} ${borderClass}`}>
      <div
        className={`font-mono text-2xl font-bold ${colorClass}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value}
      </div>
      <div className={`text-xs font-medium ${colorClass} opacity-80`}>{label}</div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>
    </div>
  )
}

interface ActionEffectivenessListProps {
  effectivenessData: ActionEffectiveness[]
  actionItems: ActionItem[]
  onViewDetail?: (actionId: string) => void
}

export function ActionEffectivenessList({
  effectivenessData,
  actionItems,
  onViewDetail,
}: ActionEffectivenessListProps) {
  const total = effectivenessData.length
  const resolvedCount = effectivenessData.filter((e) => e.verdict === 'resolved').length
  const monitoringCount = effectivenessData.filter((e) => e.verdict === 'monitoring').length
  const escalatedCount = effectivenessData.filter((e) => e.verdict === 'escalated').length
  const avgScore =
    total > 0
      ? Math.round(
          effectivenessData.reduce((sum, e) => sum + e.effectivenessScore, 0) / total
        )
      : 0

  const getActionItem = (actionId: string) =>
    actionItems.find((a) => a.id === actionId)

  if (total === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
        <TrendingUp className="mx-auto mb-3 size-10 text-slate-300 dark:text-slate-600" />
        <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
          No evaluations yet
        </h3>
        <p className="mx-auto max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Effectiveness is evaluated 1–2 periods after an action is marked completed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Aggregate stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AggregateStat
          value={total > 0 ? `${Math.round((resolvedCount / total) * 100)}%` : '—'}
          label="Resolved"
          sub={`${resolvedCount} of ${total}`}
          colorClass="text-teal-700 dark:text-teal-300"
          borderClass="border-teal-200 dark:border-teal-800"
          bgClass="bg-teal-50 dark:bg-teal-950/30"
        />
        <AggregateStat
          value={total > 0 ? `${Math.round((monitoringCount / total) * 100)}%` : '—'}
          label="Monitoring"
          sub={`${monitoringCount} of ${total}`}
          colorClass="text-amber-700 dark:text-amber-300"
          borderClass="border-amber-200 dark:border-amber-800"
          bgClass="bg-amber-50 dark:bg-amber-950/30"
        />
        <AggregateStat
          value={total > 0 ? `${Math.round((escalatedCount / total) * 100)}%` : '—'}
          label="Escalated"
          sub={`${escalatedCount} of ${total}`}
          colorClass="text-red-700 dark:text-red-300"
          borderClass="border-red-200 dark:border-red-800"
          bgClass="bg-red-50 dark:bg-red-950/30"
        />
        <AggregateStat
          value={String(avgScore)}
          label="Avg Score"
          sub="out of 100"
          colorClass="text-slate-700 dark:text-slate-300"
          borderClass="border-slate-200 dark:border-slate-700"
          bgClass="bg-slate-50 dark:bg-slate-800/50"
        />
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Evaluated actions
        </h3>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {effectivenessData.map((eff) => {
          const item = getActionItem(eff.actionId)
          if (!item) return null
          const config = verdictConfig[eff.verdict]

          return (
            <div
              key={eff.actionId}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {item.engineerName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.engineerName}
                    </span>
                    {item.pillar && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {item.pillar}
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      {eff.patternName}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>

                {/* Score */}
                <div className="hidden shrink-0 flex-col items-end sm:flex">
                  <span
                    className="font-mono text-lg font-bold text-slate-900 dark:text-white"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {eff.effectivenessScore}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500">score</span>
                </div>

                {/* Verdict badge */}
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${config.badge}`}
                >
                  {config.label}
                </span>

                {/* View button */}
                <button
                  onClick={() => onViewDetail?.(eff.actionId)}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  View
                  <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
