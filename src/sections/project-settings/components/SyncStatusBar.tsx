import type { SyncStatus } from '@/../product/sections/project-settings/types'

interface SyncStatusBarProps {
  syncStatus: SyncStatus
  onManualSync?: () => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function SyncStatusBar({ syncStatus, onManualSync }: SyncStatusBarProps) {
  const hasErrors = syncStatus.errors.length > 0

  return (
    <div className={`
      relative overflow-hidden rounded-xl border-2
      ${hasErrors
        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
        : 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900'
      }
    `}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Status Info */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
              ${hasErrors
                ? 'bg-amber-100 dark:bg-amber-900/40'
                : 'bg-teal-100 dark:bg-teal-900/40'
              }
            `}>
              {hasErrors ? (
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`
                  text-sm font-semibold
                  ${hasErrors
                    ? 'text-amber-900 dark:text-amber-100'
                    : 'text-teal-900 dark:text-teal-100'
                  }
                `}>
                  {hasErrors ? 'Sync Issues Detected' : 'Sync Healthy'}
                </h3>
                <span className={`
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${hasErrors
                    ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                    : 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                  }
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasErrors ? 'bg-amber-500' : 'bg-teal-500'}`} />
                  {syncStatus.activeRepositoriesCount} active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                <span>Last synced {formatDate(syncStatus.lastSuccessfulSync)}</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span className="font-mono">{syncStatus.totalPRsIngested} PRs ingested</span>
                {hasErrors && (
                  <>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {syncStatus.errors.length} {syncStatus.errors.length === 1 ? 'error' : 'errors'}
                    </span>
                  </>
                )}
              </div>

              {/* Error Messages */}
              {hasErrors && (
                <div className="mt-3 space-y-2">
                  {syncStatus.errors.map((error, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <span className="font-mono text-amber-900 dark:text-amber-100">{error.repositoryName}:</span>
                        <span className="text-amber-700 dark:text-amber-300 ml-1">{error.errorMessage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <button
              onClick={onManualSync}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200 hover:scale-105
                ${hasErrors
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {hasErrors ? 'Retry Sync' : 'Sync Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
