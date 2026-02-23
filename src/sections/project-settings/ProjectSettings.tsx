import data from '@/../product/sections/project-settings/data.json'
import { ProjectSettings } from './components/ProjectSettings'
import type {
  GitHubInstallation,
  GitHubRepository,
  EngineerGitHubMapping,
  UnmatchedContributor,
  SyncStatus,
} from '@/../product/sections/project-settings/types'

export default function ProjectSettingsPreview() {
  return (
    <ProjectSettings
      gitHubInstallation={data.gitHubInstallation as GitHubInstallation}
      repositories={data.repositories as GitHubRepository[]}
      currentProjectId="proj-001"
      engineerMappings={data.engineerMappings as EngineerGitHubMapping[]}
      unmatchedContributors={data.unmatchedContributors as UnmatchedContributor[]}
      syncStatus={data.syncStatus as SyncStatus}
      onConnectGitHub={() => console.log('Connect GitHub - redirect to GitHub App installation')}
      onDisconnectGitHub={() => console.log('Disconnect GitHub')}
      onLinkRepository={(id) => console.log('Link repository:', id)}
      onUnlinkRepository={(id) => console.log('Unlink repository:', id)}
      onUpdateEngineerMapping={(engineerId, username) => console.log('Update mapping:', engineerId, username)}
      onAssignContributor={(contributorId, engineerId) => console.log('Assign contributor:', contributorId, 'to', engineerId)}
      onDismissContributor={(contributorId) => console.log('Dismiss contributor:', contributorId)}
      onManualSync={() => console.log('Manual sync triggered')}
      onRetryRepositorySync={(id) => console.log('Retry sync for repository:', id)}
    />
  )
}
