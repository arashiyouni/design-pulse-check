// =============================================================================
// Data Types
// =============================================================================

export interface Organization {
  id: string
  name: string
  logoUrl: string | null
  industry: string
  contactName: string
  contactEmail: string
  projectCount: number
}

export interface ProjectEngineer {
  engineerId: string
  engineerName: string
  level: 'Junior' | 'Mid' | 'Senior' | 'Staff'
  role: 'lead' | 'engineer'
}

export interface Integration {
  id: string
  type: 'github' | 'jira' | 'linear'
  status: 'connected' | 'disconnected' | 'error'
  connectedAt: string | null
  lastSyncAt: string | null
  externalProjectName: string | null
  externalProjectUrl: string | null
  syncedItemCount: number
  errorMessage?: string
}

export interface Project {
  id: string
  name: string
  description: string
  organizationId: string | null
  organizationName: string | null
  type: 'client' | 'internal'
  status: 'active' | 'archived'
  createdAt: string
  lastActivityAt: string
  engineerCount: number
  engineers: ProjectEngineer[]
  integrations: Integration[]
}

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
  visibility: 'public' | 'private'
  project: { id: string; name: string } | null
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
  /** List of client organizations available for project assignment */
  organizations: Organization[]
  /** All projects with their team and integration info */
  projects: Project[]
  /** GitHub App installation status (for the currently viewed project's GitHub detail) */
  gitHubInstallation: GitHubInstallation
  /** ID of the project currently being viewed */
  currentProjectId: string
  /** GitHub repositories for the currently viewed project */
  repositories: GitHubRepository[]
  /** Engineer-to-GitHub username mappings for the currently viewed project */
  engineerMappings: EngineerGitHubMapping[]
  /** GitHub contributors not yet mapped to engineers */
  unmatchedContributors: UnmatchedContributor[]
  /** Overall GitHub integration health and sync status */
  syncStatus: SyncStatus

  // ── Project management callbacks ──────────────────────────────────────────
  /** Called when user submits the new project wizard */
  onCreateProject?: (project: { name: string; organizationId: string | null; type: 'client' | 'internal'; description?: string; engineerIds?: string[]; leadEngineerId?: string }) => void
  /** Called when user edits a project's details */
  onEditProject?: (projectId: string, updates: Partial<Pick<Project, 'name' | 'description' | 'organizationId' | 'type'>>) => void
  /** Called when user archives or reactivates a project */
  onToggleProjectStatus?: (projectId: string, status: 'active' | 'archived') => void
  /** Called when user clicks into a project to view its settings */
  onSelectProject?: (projectId: string) => void

  // ── Integration callbacks ─────────────────────────────────────────────────
  /** Called when user initiates connecting an integration */
  onConnectIntegration?: (projectId: string, type: 'github' | 'jira' | 'linear') => void
  /** Called when user disconnects an integration */
  onDisconnectIntegration?: (projectId: string, integrationId: string) => void

  // ── GitHub detail callbacks (existing) ────────────────────────────────────
  /** Called when user wants to connect the GitHub App (redirects to GitHub) */
  onConnectGitHub?: () => void
  /** Called when user wants to disconnect the GitHub App */
  onDisconnectGitHub?: () => void
  /** Called when user links a repository to the current project */
  onLinkRepository?: (repositoryId: string) => void
  /** Called when user unlinks a repository from the current project */
  onUnlinkRepository?: (repositoryId: string) => void
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
