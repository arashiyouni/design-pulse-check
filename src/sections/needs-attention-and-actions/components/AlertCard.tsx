import type { Alert } from '@/../product/sections/needs-attention-and-actions/types'
import { AlertTriangle, Eye, ChevronRight, Check } from 'lucide-react'
import { AlertSparkline } from './AlertSparkline'

const severityStyles: Record<string, { badge: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  attention: {
    badge: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    border: 'border-l-red-500',
    icon: AlertTriangle,
  },
  monitor: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    border: 'border-l-amber-400',
    icon: Eye,
  },
}

interface AlertCardProps {
  alert: Alert
  onViewDetail?: () => void
  onAcknowledge?: () => void
  onCreateAction?: () => void
}

export function AlertCard({ alert, onViewDetail, onAcknowledge, onCreateAction }: AlertCardProps) {
  const sev = severityStyles[alert.severity]
  const SeverityIcon = sev.icon

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 border-l-4 ${sev.border} bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {alert.engineerName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{alert.engineerName}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{formatDate(alert.triggeredAt)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {alert.acknowledged && (
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Check className="size-3" />
                Ack
              </span>
            )}
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${sev.badge}`}>
              <SeverityIcon className="size-3" />
              {alert.severity}
            </span>
          </div>
        </div>

        {/* Pattern name + description */}
        <div className="mb-3">
          <div className="mb-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {alert.patternName}
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {alert.triggerDescription}
          </p>
        </div>

        {/* Affected metrics with sparklines */}
        <div className="mb-4 flex flex-wrap gap-3">
          {alert.affectedMetrics.map((metric) => (
            <div
              key={metric.name}
              className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50"
            >
              <div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{metric.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{metric.currentValue}</span>
                  {metric.threshold > 0 && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">/ {metric.threshold}</span>
                  )}
                </div>
              </div>
              <AlertSparkline data={metric.sparkline} trend={metric.trend} width={70} height={22} />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetail}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            View Detail
            <ChevronRight className="size-3" />
          </button>
          {!alert.acknowledged && (
            <button
              onClick={onAcknowledge}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Check className="size-3" />
              Acknowledge
            </button>
          )}
          <button
            onClick={onCreateAction}
            className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            Create Action
          </button>
        </div>
      </div>
    </div>
  )
}
