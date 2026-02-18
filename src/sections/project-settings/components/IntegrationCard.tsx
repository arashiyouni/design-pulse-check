import type { Integration } from '@/../product/sections/project-settings/types'
import { ExternalLink, RefreshCw, AlertTriangle, Check, Unplug } from 'lucide-react'

interface IntegrationCardProps {
  integration?: Integration
  type: 'github' | 'jira' | 'linear'
  onConnect?: () => void
  onManage?: () => void
  onDisconnect?: () => void
}

const integrationMeta: Record<string, {
  label: string
  description: string
  icon: React.ReactNode
  iconBg: string
  comingSoon: boolean
}> = {
  github: {
    label: 'GitHub',
    description: 'Track pull requests, code reviews, and deployment frequency from your repositories.',
    icon: (
      <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    iconBg: 'bg-slate-900 dark:bg-white dark:text-slate-900',
    comingSoon: false,
  },
  jira: {
    label: 'Jira',
    description: 'Sync sprints, ticket velocity, and investment mix from your Jira boards.',
    icon: (
      <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005z" />
        <path d="M5.024 5.958H16.59a5.218 5.218 0 00-5.232-5.215H9.228V-1.314A5.215 5.215 0 004.019 4.958v.995a1.005 1.005 0 001.005 1.005z" opacity=".65" />
        <path d="M16.59 5.958a5.218 5.218 0 00-5.232 5.215v2.057a5.215 5.215 0 005.215 5.257V6.963a1.005 1.005 0 00-1.005-1.005H16.59z" opacity=".35" />
      </svg>
    ),
    iconBg: 'bg-blue-600',
    comingSoon: false,
  },
  linear: {
    label: 'Linear',
    description: 'Connect issue tracking, cycle throughput, and project progress from Linear.',
    icon: (
      <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.088 15.32a11.998 11.998 0 006.592 6.592L2.088 15.32zM1.003 12.96a12.02 12.02 0 001.517 5.243l6.72 6.72A12.02 12.02 0 0014.48 26.44L1.003 12.96zM3.47 6.23A12 12 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0a12 12 0 00-8.53 3.53l14.06 14.06A7.5 7.5 0 1012 4.5a7.48 7.48 0 00-5.34 2.22L3.47 6.23z" />
      </svg>
    ),
    iconBg: 'bg-violet-600',
    comingSoon: false,
  },
}

function formatSyncTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function IntegrationCard({ integration, type, onConnect, onManage, onDisconnect }: IntegrationCardProps) {
  const meta = integrationMeta[type]
  const isConnected = integration?.status === 'connected'
  const hasError = integration?.status === 'error'
  const isDisconnected = !integration || integration.status === 'disconnected'

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 transition-all ${
      isConnected
        ? 'border-teal-200 bg-white dark:border-teal-800/60 dark:bg-slate-900'
        : hasError
          ? 'border-red-200 bg-white dark:border-red-800/60 dark:bg-slate-900'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
    }`}>
      {/* Status stripe at top */}
      <div className={`h-1 ${
        isConnected
          ? 'bg-gradient-to-r from-teal-400 to-teal-500'
          : hasError
            ? 'bg-gradient-to-r from-red-400 to-red-500'
            : 'bg-slate-200 dark:bg-slate-700'
      }`} />

      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex size-11 items-center justify-center rounded-xl shadow-md ${meta.iconBg}`}>
              {meta.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{meta.label}</h3>
              {isConnected && integration?.externalProjectName && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {integration.externalProjectName}
                  </span>
                  {integration.externalProjectUrl && (
                    <a
                      href={integration.externalProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-teal-500 dark:text-slate-500 dark:hover:text-teal-400"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              )}
              {hasError && (
                <span className="text-xs font-medium text-red-600 dark:text-red-400">Connection error</span>
              )}
              {isDisconnected && (
                <span className="text-xs text-slate-500 dark:text-slate-400">Not connected</span>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div>
            {isConnected && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                <Check className="size-3" />
                Connected
              </span>
            )}
            {hasError && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                <AlertTriangle className="size-3" />
                Error
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {meta.description}
        </p>

        {/* Connected stats */}
        {isConnected && integration && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="text-xs font-medium text-slate-400 dark:text-slate-500">Synced Items</div>
              <div className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white font-mono">
                {integration.syncedItemCount.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="text-xs font-medium text-slate-400 dark:text-slate-500">Last Sync</div>
              <div className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white font-mono">
                {integration.lastSyncAt ? formatSyncTime(integration.lastSyncAt) : '—'}
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {hasError && integration?.errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-500" />
              <p className="text-xs leading-relaxed text-red-700 dark:text-red-300">
                {integration.errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isConnected && (
            <>
              <button
                onClick={onManage}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-[0.98] dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                Manage
              </button>
              <button
                onClick={onDisconnect}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                title="Disconnect"
              >
                <Unplug className="size-4" />
              </button>
            </>
          )}
          {hasError && (
            <>
              <button
                onClick={onConnect}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                <RefreshCw className="size-4" />
                Reconnect
              </button>
              <button
                onClick={onDisconnect}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                title="Disconnect"
              >
                <Unplug className="size-4" />
              </button>
            </>
          )}
          {isDisconnected && (
            <button
              onClick={onConnect}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-all hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600 active:scale-[0.98] dark:border-slate-600 dark:text-slate-400 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 dark:hover:text-teal-400"
            >
              Connect {meta.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
