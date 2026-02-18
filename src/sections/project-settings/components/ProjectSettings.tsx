import type { ProjectSettingsProps } from '@/../product/sections/project-settings/types'
import { DisconnectedState } from './DisconnectedState'
import { SyncStatusBar } from './SyncStatusBar'
import { RepositoryList } from './RepositoryList'
import { EngineerMappingTable } from './EngineerMappingTable'
import { UnmatchedContributors } from './UnmatchedContributors'

export function ProjectSettings({
  gitHubInstallation,
  repositories,
  engineerMappings,
  unmatchedContributors,
  syncStatus,
  onConnectGitHub,
  onDisconnectGitHub,
  onToggleRepository,
  onUpdateEngineerMapping,
  onAssignContributor,
  onDismissContributor,
  onManualSync,
  onRetryRepositorySync
}: ProjectSettingsProps) {
  // Show disconnected state if not connected
  if (gitHubInstallation.status === 'disconnected' || gitHubInstallation.status === 'pending') {
    return <DisconnectedState onConnect={onConnectGitHub} />
  }

  // Show expired state
  if (gitHubInstallation.status === 'expired') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
            <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-lg">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              GitHub Access Expired
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The GitHub App installation has been revoked or expired. Reconnect to restore delivery metrics tracking.
            </p>
          </div>
          <button
            onClick={onConnectGitHub}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Reconnect GitHub
          </button>
        </div>
      </div>
    )
  }

  // Connected state - show full interface
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header with Installation Info */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                GitHub Integration
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                {gitHubInstallation.organizationName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-15">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Connected
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              since {new Date(gitHubInstallation.installedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      <SyncStatusBar
        syncStatus={syncStatus}
        onManualSync={onManualSync}
      />

      {/* Repositories */}
      <RepositoryList
        repositories={repositories}
        onToggleRepository={onToggleRepository}
        onRetrySync={onRetryRepositorySync}
      />

      {/* Engineer Mappings */}
      <EngineerMappingTable
        engineerMappings={engineerMappings}
        onUpdateMapping={onUpdateEngineerMapping}
      />

      {/* Unmatched Contributors */}
      <UnmatchedContributors
        unmatchedContributors={unmatchedContributors}
        engineerMappings={engineerMappings}
        onAssignContributor={onAssignContributor}
        onDismissContributor={onDismissContributor}
      />

      {/* Danger Zone */}
      <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                Disconnect GitHub
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This will remove all repository links and engineer mappings for this project. The GitHub App will remain installed for your organization.
              </p>
            </div>
            <button
              onClick={onDisconnectGitHub}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
