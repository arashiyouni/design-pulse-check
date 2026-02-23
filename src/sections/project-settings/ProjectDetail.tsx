import data from '@/../product/sections/project-settings/data.json'
import { ProjectDetail } from './components/ProjectDetail'
import type {
  Project,
  GitHubInstallation,
  GitHubRepository,
  EngineerGitHubMapping,
  UnmatchedContributor,
  SyncStatus,
} from '@/../product/sections/project-settings/types'

export default function ProjectDetailPreview() {
  // Use the first project (Acme Marketplace Rebuild) which has both GitHub and Jira connected
  const project = data.projects[0] as Project

  return (
    <ProjectDetail
      project={project}
      gitHubInstallation={data.gitHubInstallation as GitHubInstallation}
      repositories={data.repositories as GitHubRepository[]}
      engineerMappings={data.engineerMappings as EngineerGitHubMapping[]}
      unmatchedContributors={data.unmatchedContributors as UnmatchedContributor[]}
      syncStatus={data.syncStatus as SyncStatus}
      onBack={() => console.log('Back to project list')}
      onEditProject={(id, updates) => console.log('Edit project:', id, updates)}
      onConnectIntegration={(projectId, type) => console.log('Connect integration:', projectId, type)}
      onDisconnectIntegration={(projectId, integrationId) => console.log('Disconnect integration:', projectId, integrationId)}
      onConnectGitHub={() => console.log('Connect GitHub App')}
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
