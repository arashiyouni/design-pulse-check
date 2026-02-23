import type { GitHubRepository } from '@/../product/sections/project-settings/types'

interface RepositoryListProps {
  repositories: GitHubRepository[]
  currentProjectId: string
  onLinkRepository?: (repositoryId: string) => void
  onUnlinkRepository?: (repositoryId: string) => void
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

function VisibilityIcon({ visibility }: { visibility: 'public' | 'private' }) {
  if (visibility === 'private') {
    return (
      <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
    )
  }
  return (
    <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
    </svg>
  )
}

function RepositoryRow({
  repository,
  variant,
  onLink,
  onUnlink,
  onRetry
}: {
  repository: GitHubRepository
  variant: 'linked' | 'available' | 'other-project'
  onLink?: (id: string) => void
  onUnlink?: (id: string) => void
  onRetry?: (id: string) => void
}) {
  const hasError = repository.syncStatus === 'error'

  const borderStyles = {
    linked: 'bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-900 hover:border-teal-300 dark:hover:border-teal-800',
    available: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
    'other-project': 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-900 opacity-60'
  }

  return (
    <div className={`
      group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200
      ${borderStyles[variant]}
    `}>
      {/* Repository Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${variant === 'linked'
              ? 'bg-teal-50 dark:bg-teal-900/30'
              : 'bg-slate-100 dark:bg-slate-800'
            }
          `}>
            <svg className={`w-5 h-5 ${variant === 'linked' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {/* Name, Owner, and Visibility */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {repository.name}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {repository.owner}
              </span>
              <VisibilityIcon visibility={repository.visibility} />
            </div>

            {/* Sync Status */}
            {variant !== 'other-project' && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
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

                <span className="text-slate-600 dark:text-slate-400">
                  {formatDate(repository.lastSyncedAt)}
                </span>

                <span className="text-slate-500 dark:text-slate-500">•</span>

                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {repository.prCount} PRs
                </span>
              </div>
            )}

            {/* Project name for other-project variant */}
            {variant === 'other-project' && repository.project && (
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm-3 7.57V16a2 2 0 002 2h6a2 2 0 002-2v-4.43A20.958 20.958 0 0110 13a20.94 20.94 0 01-5-1.43z" clipRule="evenodd" />
                  </svg>
                  {repository.project.name}
                </span>
                <span className="text-slate-500 dark:text-slate-500">•</span>
                <span className="font-mono text-slate-500 dark:text-slate-500">
                  {repository.prCount} PRs
                </span>
              </div>
            )}

            {/* Error Message */}
            {hasError && repository.errorMessage && variant !== 'other-project' && (
              <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">
                {repository.errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:flex-shrink-0">
        {/* Retry Button (only for errors on linked/available) */}
        {hasError && variant !== 'other-project' && (
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

        {/* Link Button (available repos) */}
        {variant === 'available' && (
          <button
            onClick={() => onLink?.(repository.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 border-2 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Link
          </button>
        )}

        {/* Unlink Button (linked repos) */}
        {variant === 'linked' && (
          <button
            onClick={() => onUnlink?.(repository.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border-2 border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Unlink
          </button>
        )}
      </div>
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 pt-2">
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

export function RepositoryList({
  repositories,
  currentProjectId,
  onLinkRepository,
  onUnlinkRepository,
  onRetrySync
}: RepositoryListProps) {
  const linkedRepos = repositories.filter(r => r.project?.id === currentProjectId)
  const availableRepos = repositories.filter(r => r.project === null)
  const otherProjectRepos = repositories.filter(r => r.project !== null && r.project.id !== currentProjectId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Repositories
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {linkedRepos.length} linked · {availableRepos.length} available{otherProjectRepos.length > 0 ? ` · ${otherProjectRepos.length} elsewhere` : ''}
          </p>
        </div>
      </div>

      {/* Linked to this project */}
      {linkedRepos.length > 0 ? (
        <div className="space-y-2">
          <SectionDivider label="Linked to this project" />
          {linkedRepos.map(repo => (
            <RepositoryRow
              key={repo.id}
              repository={repo}
              variant="linked"
              onUnlink={onUnlinkRepository}
              onRetry={onRetrySync}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <SectionDivider label="Linked to this project" />
          <div className="text-center py-8 px-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No repositories linked yet. Link a repository below to start tracking PRs.
            </p>
          </div>
        </div>
      )}

      {/* Available */}
      {availableRepos.length > 0 ? (
        <div className="space-y-2">
          <SectionDivider label="Available" />
          {availableRepos.map(repo => (
            <RepositoryRow
              key={repo.id}
              repository={repo}
              variant="available"
              onLink={onLinkRepository}
              onRetry={onRetrySync}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <SectionDivider label="Available" />
          <div className="text-center py-6 px-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All repositories are linked to projects.
            </p>
          </div>
        </div>
      )}

      {/* Linked to other projects (only show if there are any) */}
      {otherProjectRepos.length > 0 && (
        <div className="space-y-2">
          <SectionDivider label="Linked to other projects" />
          {otherProjectRepos.map(repo => (
            <RepositoryRow
              key={repo.id}
              repository={repo}
              variant="other-project"
            />
          ))}
        </div>
      )}
    </div>
  )
}
