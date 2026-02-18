// =============================================================================
// Data Types
// =============================================================================

export interface GitHubInstallation {
  status: 'connected' | 'disconnected' | 'pending' | 'expired'
  installedAt: string
  installationId: string
  organizationName: string
}

export interface GitHubRepository {
  id: string
  name: string
  owner: string
  fullName: string
  isActive: boolean
  lastSyncedAt: string | null
  syncStatus: 'success' | 'error' | 'syncing'
  errorMessage: string | null
  prCount: number
}

export interface EngineerGitHubMapping {
  id: string
  engineerId: string
  engineerName: string
  engineerLevel: 'Junior' | 'Mid' | 'Senior' | 'Staff'
  githubUsername: string | null
  isAutoMatched: boolean
  matchedAt: string | null
  confirmedBy: string | null
  confirmedAt: string | null
}

export interface UnmatchedContributor {
  id: string
  githubUsername: string
  displayName: string
  avatarUrl: string
  contributionsCount: number
  lastContributionAt: string
  repositoriesContributedTo: string[]
  suggestedEngineerId: string | null
}

export interface SyncError {
  repositoryId: string
  repositoryName: string
  errorCode: string
  errorMessage: string
  occurredAt: string
}

export interface SyncStatus {
  lastSuccessfulSync: string
  totalPRsIngested: number
  activeRepositoriesCount: number
  errors: SyncError[]
  nextScheduledSync: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProjectSettingsProps {
  /** The GitHub App installation status for this project */
  gitHubInstallation: GitHubInstallation
  /** List of repositories the GitHub App has access to */
  repositories: GitHubRepository[]
  /** Engineer-to-GitHub username mappings */
  engineerMappings: EngineerGitHubMapping[]
  /** GitHub contributors found in repo activity who aren't mapped yet */
  unmatchedContributors: UnmatchedContributor[]
  /** Overall integration health and sync status */
  syncStatus: SyncStatus
  /** Called when user wants to connect the GitHub App (redirects to GitHub) */
  onConnectGitHub?: () => void
  /** Called when user wants to disconnect the GitHub App */
  onDisconnectGitHub?: () => void
  /** Called when user toggles a repository's active status */
  onToggleRepository?: (repositoryId: string, isActive: boolean) => void
  /** Called when user manually edits an engineer's GitHub username */
  onUpdateEngineerMapping?: (engineerId: string, githubUsername: string) => void
  /** Called when user assigns an unmatched contributor to an engineer */
  onAssignContributor?: (contributorId: string, engineerId: string) => void
  /** Called when user dismisses an unmatched contributor */
  onDismissContributor?: (contributorId: string) => void
  /** Called when user wants to manually trigger a sync */
  onManualSync?: () => void
  /** Called when user wants to retry a failed repository sync */
  onRetryRepositorySync?: (repositoryId: string) => void
}
