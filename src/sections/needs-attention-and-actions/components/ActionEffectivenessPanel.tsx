import type {
  ActionEffectiveness,
  ActionItem,
  EffectivenessVerdict,
  MetricDelta,
} from '@/../product/sections/needs-attention-and-actions/types'
import { CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Plus, TrendingUp } from 'lucide-react'
import { AlertSparkline } from './AlertSparkline'

const verdictConfig: Record<
  EffectivenessVerdict,
  {
    label: string
    description: string
    bg: string
    border: string
    textColor: string
    subtextColor: string
    icon: React.ComponentType<{ className?: string }>
    iconClass: string
    ringColor: string
    ringTrack: string
  }
> = {
  resolved: {
    label: 'Resolved',
    description:
      'Metrics returned to healthy range within 1 period after intervention.',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-800 dark:text-teal-200',
    subtextColor: 'text-teal-600 dark:text-teal-400',
    icon: CheckCircle2,
    iconClass: 'text-teal-500 dark:text-teal-400',
    ringColor: '#14b8a6',
    ringTrack: 'stroke-teal-100 dark:stroke-teal-900',
  },
  monitoring: {
    label: 'Monitoring',
    description:
      'Some improvement detected, but metrics are not yet within healthy thresholds.',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-800 dark:text-amber-200',
    subtextColor: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
    iconClass: 'text-amber-500 dark:text-amber-400',
    ringColor: '#f59e0b',
    ringTrack: 'stroke-amber-100 dark:stroke-amber-900',
  },
  escalated: {
    label: 'Escalated',
    description:
      'Metrics continued to decline — a new alert has been triggered.',
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-800 dark:text-red-200',
    subtextColor: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle,
    iconClass: 'text-red-500 dark:text-red-400',
    ringColor: '#ef4444',
    ringTrack: 'stroke-red-100 dark:stroke-red-900',
  },
}

const trendColors: Record<string, string> = {
  improving: 'text-teal-600 dark:text-teal-400',
  stable: 'text-slate-500 dark:text-slate-400',
  declining: 'text-red-600 dark:text-red-400',
}

function ScoreRing({ score, ringColor, trackClass }: { score: number; ringColor: string; trackClass: string }) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex size-[76px] shrink-0 items-center justify-center">
      <svg width="76" height="76" className="-rotate-90">
        <circle cx="38" cy="38" r={radius} fill="none" strokeWidth="5" className={trackClass} />
        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          strokeWidth="5"
          stroke={ringColor}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-mono text-lg font-bold leading-none text-slate-900 dark:text-white"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {score}
        </span>
        <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">score</span>
      </div>
    </div>
  )
}

function MetricDeltaCard({ delta }: { delta: MetricDelta }) {
  const trendColor = trendColors[delta.trend]
  const deltaSign = delta.deltaPercent > 0 ? '+' : ''

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {/* Metric name + sparkline */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {delta.metricName}
        </span>
        <AlertSparkline data={delta.sparkline} trend={delta.trend} width={80} height={22} />
      </div>

      {/* Before → Delta → After */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <div className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            At Alert
          </div>
          <div
            className="font-mono text-2xl font-bold text-slate-300 dark:text-slate-600"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {delta.valueAtAlert}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 pb-1">
          <span className={`text-[11px] font-bold tabular-nums ${trendColor}`}>
            {deltaSign}{delta.deltaPercent.toFixed(1)}%
          </span>
          <div className={`flex items-center gap-0.5 ${trendColor}`}>
            <div className="h-px w-6 bg-current opacity-40" />
            <ArrowRight className="size-3" />
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Now
          </div>
          <div
            className={`font-mono text-2xl font-bold ${trendColor}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {delta.valueNow}
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatHappenedStepper({
  actionItem,
  evaluatedAt,
  verdict,
}: {
  actionItem: ActionItem
  evaluatedAt: string
  verdict: EffectivenessVerdict
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const evalColor =
    verdict === 'resolved'
      ? 'bg-teal-500'
      : verdict === 'monitoring'
      ? 'bg-amber-500'
      : 'bg-red-500'

  const steps = [
    {
      label: 'Action created',
      date: fmt(actionItem.createdAt),
      dotClass: 'bg-slate-500',
      Icon: Plus,
    },
    {
      label: 'Action completed',
      date: fmt(actionItem.resolvedAt ?? actionItem.dueDate),
      dotClass: 'bg-teal-500',
      Icon: CheckCircle2,
    },
    {
      label: 'Evaluated',
      date: fmt(evaluatedAt),
      dotClass: evalColor,
      Icon: TrendingUp,
    },
  ]

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const Icon = step.Icon
        return (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 && <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />}
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${step.dotClass}`}
              >
                <Icon className="size-3.5 text-white" />
              </div>
              {i < steps.length - 1 && (
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              )}
            </div>
            <div className="mt-2 text-center">
              <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                {step.label}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">{step.date}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface ActionEffectivenessPanelProps {
  effectiveness: ActionEffectiveness
  actionItem: ActionItem
  onBack?: () => void
  onCreateFollowUpAction?: (actionId: string) => void
}

export function ActionEffectivenessPanel({
  effectiveness,
  actionItem,
  onBack,
  onCreateFollowUpAction,
}: ActionEffectivenessPanelProps) {
  const config = verdictConfig[effectiveness.verdict]
  const VerdictIcon = config.icon
  const needsFollowUp =
    effectiveness.verdict === 'monitoring' || effectiveness.verdict === 'escalated'

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="space-y-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="size-4" />
        Back to Effectiveness
      </button>

      {/* Engineer + action header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {actionItem.engineerName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {actionItem.engineerName}
              </span>
              {actionItem.pillar && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {actionItem.pillar}
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {effectiveness.patternName}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {actionItem.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span>Created: {fmt(actionItem.createdAt)}</span>
          {actionItem.resolvedAt && (
            <span>Completed: {fmt(actionItem.resolvedAt)}</span>
          )}
          <span>Evaluated: {fmt(effectiveness.evaluatedAt)}</span>
        </div>
      </div>

      {/* Verdict banner */}
      <div className={`rounded-xl border p-5 ${config.bg} ${config.border}`}>
        <div className="flex items-center gap-4">
          <ScoreRing
            score={effectiveness.effectivenessScore}
            ringColor={config.ringColor}
            trackClass={config.ringTrack}
          />
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <VerdictIcon className={`size-5 ${config.iconClass}`} />
              <span className={`text-xl font-bold ${config.textColor}`}>
                {config.label}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${config.subtextColor}`}>
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* What happened */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          What happened
        </h3>
        <WhatHappenedStepper
          actionItem={actionItem}
          evaluatedAt={effectiveness.evaluatedAt}
          verdict={effectiveness.verdict}
        />
      </div>

      {/* Metric comparison */}
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Metric comparison
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {effectiveness.metricDeltas.map((delta) => (
            <MetricDeltaCard key={delta.metricName} delta={delta} />
          ))}
        </div>
      </div>

      {/* Resolution note */}
      {actionItem.resolutionNote && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Resolution note
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {actionItem.resolutionNote}
          </p>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            — {actionItem.createdBy}
          </div>
        </div>
      )}

      {/* Follow-up CTA */}
      {needsFollowUp && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {effectiveness.verdict === 'escalated'
              ? 'This engineer needs immediate attention. Create a follow-up action to address the continued decline.'
              : "Metrics are improving but haven't reached healthy thresholds yet. A follow-up action can help maintain momentum."}
          </p>
          <button
            onClick={() => onCreateFollowUpAction?.(effectiveness.actionId)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            <Plus className="size-4" />
            Create Follow-up Action
          </button>
        </div>
      )}
    </div>
  )
}
