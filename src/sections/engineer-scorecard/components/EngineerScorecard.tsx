import { useState } from 'react'
import type { EngineerScorecardProps } from '@/../product/sections/engineer-scorecard/types'
import { CalendarDays, ArrowLeftRight } from 'lucide-react'
import { PillarCard } from './PillarCard'
import { TrendBadge } from './TrendBadge'
import { PeriodComparison } from './PeriodComparison'
import { Timeline } from './Timeline'

export function EngineerScorecard({
  engineer,
  pulseScore,
  periodComparison,
  timeline,
  onPeriodChange,
  onExpandPillar,
  onTimelineEventClick,
}: EngineerScorecardProps) {
  const [showComparison, setShowComparison] = useState(false)

  // Map pillar IDs to their detail data
  const pillarDetails: Record<string, {
    deliverySubMetrics?: typeof pulseScore.deliverySubMetrics
    clientSatisfaction?: typeof pulseScore.clientSatisfaction
    teamFeedback?: typeof pulseScore.teamFeedback
    growth?: typeof pulseScore.growth
  }> = {
    delivery: { deliverySubMetrics: pulseScore.deliverySubMetrics },
    'client-satisfaction': { clientSatisfaction: pulseScore.clientSatisfaction },
    'team-feedback': { teamFeedback: pulseScore.teamFeedback },
    growth: { growth: pulseScore.growth },
  }

  // Format period for display
  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
      {/* ── Engineer Profile Header ───────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {engineer.avatarUrl ? (
            <img
              src={engineer.avatarUrl}
              alt={engineer.name}
              className="size-14 rounded-full border-2 border-white shadow-sm dark:border-slate-800"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {engineer.name.split(' ').map((n) => n[0]).join('')}
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{engineer.name}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="capitalize">{engineer.level} Engineer</span>
              <span className="text-slate-300 dark:text-slate-600">&middot;</span>
              <span>{engineer.project}</span>
            </div>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPeriodChange?.(engineer.currentPeriod)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <CalendarDays className="size-3.5 text-slate-400" />
            {formatPeriod(engineer.currentPeriod)}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              showComparison
                ? 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowLeftRight className="size-3.5" />
            Compare
          </button>
        </div>
      </div>

      {/* ── Composite Pulse Score ─────────────────────────────── */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-6">
          {/* Score ring */}
          <div className="relative mb-4 sm:mb-0">
            <div className="flex size-28 items-center justify-center rounded-full border-4 border-slate-100 dark:border-slate-800">
              <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900">
                <span className="font-mono text-4xl font-bold text-slate-900 dark:text-white">
                  {pulseScore.compositeScore}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Composite Pulse Score
            </div>
            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
              <TrendBadge trend={pulseScore.trend} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Weighted average of 4 pillars &middot; {engineer.currentPeriod}
            </p>
          </div>
        </div>
      </div>

      {/* ── Period Comparison (conditional) ────────────────────── */}
      {showComparison && periodComparison && (
        <div className="mb-8">
          <PeriodComparison comparison={periodComparison} />
        </div>
      )}

      {/* ── Pillar Cards Grid ─────────────────────────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {pulseScore.pillars.map((pillar) => (
          <PillarCard
            key={pillar.pillarId}
            pillar={pillar}
            onExpand={() => onExpandPillar?.(pillar.pillarId)}
            {...pillarDetails[pillar.pillarId]}
          />
        ))}
      </div>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <Timeline events={timeline} onEventClick={onTimelineEventClick} />
    </div>
  )
}
