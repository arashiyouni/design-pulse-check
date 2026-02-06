import type { Integration } from '@/../product/sections/data-ingestion-and-signals/types'
import { Github, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Unplug, Plug } from 'lucide-react'

const integrationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  jira: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84H11.53Zm-4.67 4.65c-.01 2.4 1.95 4.35 4.35 4.36h1.78v1.72c0 2.4 1.95 4.34 4.35 4.35V7.5a.84.84 0 0 0-.84-.84H6.86ZM2.16 11.31c0 2.4 1.95 4.35 4.35 4.36h1.78v1.71c.01 2.4 1.96 4.35 4.36 4.35v-9.58a.84.84 0 0 0-.84-.84H2.16Z" />
    </svg>
  ),
  linear: () => (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.357 13.606a9.63 9.63 0 0 1-.188-1.9c0-.646.064-1.277.188-1.887l6.56 6.56a9.453 9.453 0 0 1-1.887.188c-.649 0-1.283-.064-1.9-.188l-4.773-4.773ZM4.05 9.042a9.63 9.63 0 0 1 1.138-2.308L12.71 14.26a9.63 9.63 0 0 1-2.308 1.138L4.05 9.042Zm2.304-3.474A9.577 9.577 0 0 1 12 3.364c5.312 0 9.636 4.324 9.636 9.636 0 2.165-.72 4.162-1.932 5.772L6.354 5.568Z" />
    </svg>
  ),
}

interface IntegrationCardsProps {
  integrations: Integration[]
  onConnect?: (type: 'github' | 'jira' | 'linear') => void
  onDisconnect?: (id: string) => void
  onSync?: (id: string) => void
}

export function IntegrationCards({ integrations, onConnect, onDisconnect, onSync }: IntegrationCardsProps) {
  const formatSyncTime = (iso: string | null) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => {
        const Icon = integrationIcons[integration.type] || Github
        const isConnected = integration.status === 'connected'
        const isError = integration.status === 'error'

        return (
          <div
            key={integration.id}
            className={`rounded-xl border p-5 transition-colors ${
              isConnected
                ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                : isError
                  ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20'
                  : 'border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50'
            }`}
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-lg ${
                  isConnected
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
                  <div className="flex items-center gap-1.5">
                    {isConnected && <CheckCircle2 className="size-3 text-teal-500 dark:text-teal-400" />}
                    {isError && <AlertTriangle className="size-3 text-red-500 dark:text-red-400" />}
                    {!isConnected && !isError && <XCircle className="size-3 text-slate-400 dark:text-slate-500" />}
                    <span className={`text-xs ${
                      isConnected ? 'text-teal-600 dark:text-teal-400'
                      : isError ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {isConnected ? 'Connected' : isError ? 'Error' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {isConnected && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                {integration.type === 'github' ? (
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Repositories</span>
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{integration.repoCount}</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Projects</span>
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{integration.projectCount}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Sync</span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatSyncTime(integration.lastSyncAt)}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {isError && integration.errorMessage && (
              <div className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {integration.errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {isConnected ? (
                <>
                  <button
                    onClick={() => onSync?.(integration.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <RefreshCw className="size-3" />
                    Sync Now
                  </button>
                  <button
                    onClick={() => onDisconnect?.(integration.id)}
                    className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Unplug className="size-3" />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onConnect?.(integration.type)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
                >
                  <Plug className="size-3" />
                  Connect {integration.name}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
