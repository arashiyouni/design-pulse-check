import type { GitHubRepository } from '@/../product/sections/project-settings/types'

interface RepositoryListProps {
  repositories: GitHubRepository[]
  onToggleRepository?: (repositoryId: string, isActive: boolean) => void
  onRetrySync?: (repositoryId: string) => void
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Never'

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function RepositoryRow({
  repository,
  onToggle,
  onRetry
}: {
  repository: GitHubRepository
  onToggle?: (id: string, active: boolean) => void
  onRetry?: (id: string) => void
}) {
  const hasError = repository.syncStatus === 'error'

  return (
    <div className={`
      group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200
      ${repository.isActive
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800'
        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-900 opacity-60'
      }
    `}>
      {/* Repository Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${repository.isActive
              ? 'bg-slate-100 dark:bg-slate-800'
              : 'bg-slate-200 dark:bg-slate-800/50'
            }
          `}>
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {/* Name and Owner */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {repository.name}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {repository.owner}
              </span>
            </div>

            {/* Sync Status */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {/* Status Badge */}
              {hasError ? (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Sync failed
                </span>
              ) : repository.syncStatus === 'syncing' ? (
                <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Syncing...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Synced
                </span>
              )}

              <span className="text-slate-500 dark:text-slate-500">•</span>

              {/* Last Synced */}
              <span className="text-slate-600 dark:text-slate-400">
                {formatDate(repository.lastSyncedAt)}
              </span>

              <span className="text-slate-500 dark:text-slate-500">•</span>

              {/* PR Count */}
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {repository.prCount} PRs
              </span>
            </div>

            {/* Error Message */}
            {hasError && repository.errorMessage && (
              <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">
                {repository.errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:flex-shrink-0">
        {/* Retry Button (only for errors) */}
        {hasError && (
          <button
            onClick={() => onRetry?.(repository.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        )}

        {/* Toggle Switch */}
        <button
          onClick={() => onToggle?.(repository.id, !repository.isActive)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
            ${repository.isActive
              ? 'bg-teal-600'
              : 'bg-slate-200 dark:bg-slate-700'
            }
          `}
          role="switch"
          aria-checked={repository.isActive}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
              transition duration-200 ease-in-out
              ${repository.isActive ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  )
}

export function RepositoryList({ repositories, onToggleRepository, onRetrySync }: RepositoryListProps) {
  const activeRepos = repositories.filter(r => r.isActive)
  const inactiveRepos = repositories.filter(r => !r.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Repositories
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {activeRepos.length} active • {inactiveRepos.length} inactive
          </p>
        </div>
      </div>

      {/* Active Repositories */}
      {activeRepos.length > 0 && (
        <div className="space-y-2">
          {activeRepos.map(repo => (
            <RepositoryRow
              key={repo.id}
              repository={repo}
              onToggle={onToggleRepository}
              onRetry={onRetrySync}
            />
          ))}
        </div>
      )}

      {/* Inactive Repositories */}
      {inactiveRepos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
              Inactive
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          {inactiveRepos.map(repo => (
            <RepositoryRow
              key={repo.id}
              repository={repo}
              onToggle={onToggleRepository}
              onRetry={onRetrySync}
            />
          ))}
        </div>
      )}
    </div>
  )
}
