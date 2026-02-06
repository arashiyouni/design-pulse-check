import type { IngestionHealth } from '@/../product/sections/data-ingestion-and-signals/types'
import { CheckCircle2, AlertTriangle, XCircle, Database } from 'lucide-react'

const statusConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  dot: string
  text: string
  label: string
}> = {
  healthy: {
    icon: CheckCircle2,
    dot: 'bg-teal-500',
    text: 'text-teal-700 dark:text-teal-400',
    label: 'Healthy',
  },
  warning: {
    icon: AlertTriangle,
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400',
    label: 'Error',
  },
}

interface IngestionHealthDashboardProps {
  healthData: IngestionHealth[]
}

export function IngestionHealthDashboard({ healthData }: IngestionHealthDashboardProps) {
  const formatSyncTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const totalRecords = healthData.reduce((sum, h) => sum + h.recordsThisPeriod, 0)
  const totalErrors = healthData.reduce((sum, h) => sum + h.errorCount, 0)
  const healthyCount = healthData.filter((h) => h.status === 'healthy').length

  return (
    <div>
      {/* Summary row */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <Database className="size-4 text-slate-500 dark:text-slate-400" />
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{totalRecords.toLocaleString()}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">records this period</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 dark:bg-teal-950/30">
          <CheckCircle2 className="size-4 text-teal-500 dark:text-teal-400" />
          <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-300">{healthyCount}/{healthData.length}</span>
          <span className="text-xs text-teal-600 dark:text-teal-400">sources healthy</span>
        </div>
        {totalErrors > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/30">
            <AlertTriangle className="size-4 text-red-500 dark:text-red-400" />
            <span className="font-mono text-sm font-bold text-red-700 dark:text-red-300">{totalErrors}</span>
            <span className="text-xs text-red-600 dark:text-red-400">errors</span>
          </div>
        )}
      </div>

      {/* Health table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Desktop table */}
        <table className="hidden w-full sm:table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Last Sync</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Records</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Errors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {healthData.map((item) => {
              const config = statusConfig[item.status]
              return (
                <tr key={item.source} className="bg-white transition-colors hover:bg-slate-50/50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{item.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${config.dot}`} />
                      <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatSyncTime(item.lastSuccessfulSync)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">{item.recordsThisPeriod.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-sm ${
                      item.errorCount > 0 ? 'font-medium text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {item.errorCount}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-800">
          {healthData.map((item) => {
            const config = statusConfig[item.status]
            return (
              <div key={item.source} className="bg-white p-4 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{item.source}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${config.dot}`} />
                    <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatSyncTime(item.lastSuccessfulSync)}</span>
                  <span className="font-mono">{item.recordsThisPeriod.toLocaleString()} records</span>
                  {item.errorCount > 0 && (
                    <span className="font-mono text-red-600 dark:text-red-400">{item.errorCount} errors</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
