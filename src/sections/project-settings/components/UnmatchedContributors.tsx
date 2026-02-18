import { useState } from 'react'
import type { UnmatchedContributor, EngineerGitHubMapping } from '@/../product/sections/project-settings/types'

interface UnmatchedContributorsProps {
  unmatchedContributors: UnmatchedContributor[]
  engineerMappings: EngineerGitHubMapping[]
  onAssignContributor?: (contributorId: string, engineerId: string) => void
  onDismissContributor?: (contributorId: string) => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function ContributorRow({
  contributor,
  engineers,
  onAssign,
  onDismiss
}: {
  contributor: UnmatchedContributor
  engineers: EngineerGitHubMapping[]
  onAssign?: (contributorId: string, engineerId: string) => void
  onDismiss?: (contributorId: string) => void
}) {
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedEngineerId, setSelectedEngineerId] = useState('')

  const handleAssign = () => {
    if (selectedEngineerId) {
      onAssign?.(contributor.id, selectedEngineerId)
      setIsAssigning(false)
      setSelectedEngineerId('')
    }
  }

  const unmappedEngineers = engineers.filter(e => !e.githubUsername)

  return (
    <div className="group relative p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800 transition-colors bg-white dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Contributor Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <img
            src={contributor.avatarUrl}
            alt={contributor.displayName}
            className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
          />

          <div className="flex-1 min-w-0">
            {/* Name and Username */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {contributor.displayName}
              </h3>
              <a
                href={`https://github.com/${contributor.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                @{contributor.githubUsername}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {contributor.contributionsCount} contributions
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Last active {formatDate(contributor.lastContributionAt)}</span>
            </div>

            {/* Repositories */}
            <div className="mt-2 flex flex-wrap gap-1">
              {contributor.repositoriesContributedTo.map((repo, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {repo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-start gap-2 sm:flex-shrink-0">
          {isAssigning ? (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <select
                value={selectedEngineerId}
                onChange={(e) => setSelectedEngineerId(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border-2 border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              >
                <option value="">Select engineer...</option>
                {unmappedEngineers.map(engineer => (
                  <option key={engineer.engineerId} value={engineer.engineerId}>
                    {engineer.engineerName} ({engineer.engineerLevel})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAssign}
                  disabled={!selectedEngineerId}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Assign
                </button>
                <button
                  onClick={() => {
                    setIsAssigning(false)
                    setSelectedEngineerId('')
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsAssigning(true)}
                disabled={unmappedEngineers.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                title={unmappedEngineers.length === 0 ? 'All engineers are already mapped' : 'Assign to engineer'}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Assign
              </button>
              <button
                onClick={() => onDismiss?.(contributor.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Dismiss
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function UnmatchedContributors({
  unmatchedContributors,
  engineerMappings,
  onAssignContributor,
  onDismissContributor
}: UnmatchedContributorsProps) {
  if (unmatchedContributors.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Unmatched Contributors
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            {unmatchedContributors.length}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          GitHub users found in repository activity who aren't mapped to engineers
        </p>
      </div>

      {/* Contributors List */}
      <div className="space-y-2">
        {unmatchedContributors.map(contributor => (
          <ContributorRow
            key={contributor.id}
            contributor={contributor}
            engineers={engineerMappings}
            onAssign={onAssignContributor}
            onDismiss={onDismissContributor}
          />
        ))}
      </div>
    </div>
  )
}
