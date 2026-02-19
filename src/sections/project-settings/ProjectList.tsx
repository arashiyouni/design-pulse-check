import data from '@/../product/sections/project-settings/data.json'
import { ProjectList } from './components/ProjectList'
import type {
  Organization,
  Project,
  GitHubInstallation,
  GitHubRepository,
  EngineerGitHubMapping,
  UnmatchedContributor,
  SyncStatus,
} from '@/../product/sections/project-settings/types'

export default function ProjectListPreview() {
  return (
    <ProjectList
      organizations={data.organizations as Organization[]}
      projects={data.projects as Project[]}
      gitHubInstallation={data.gitHubInstallation as GitHubInstallation}
      repositories={data.repositories as GitHubRepository[]}
      engineerMappings={data.engineerMappings as EngineerGitHubMapping[]}
      unmatchedContributors={data.unmatchedContributors as UnmatchedContributor[]}
      syncStatus={data.syncStatus as SyncStatus}
      onCreateProject={(project) => console.log('Create project:', project)}
      onEditProject={(id, updates) => console.log('Edit project:', id, updates)}
      onToggleProjectStatus={(id, status) => console.log('Toggle project status:', id, status)}
      onSelectProject={(id) => console.log('Select project:', id)}
      onConnectIntegration={(projectId, type) => console.log('Connect integration:', projectId, type)}
      onDisconnectIntegration={(projectId, integrationId) => console.log('Disconnect integration:', projectId, integrationId)}
      onConnectGitHub={() => console.log('Connect GitHub')}
      onDisconnectGitHub={() => console.log('Disconnect GitHub')}
      onToggleRepository={(id, isActive) => console.log('Toggle repository:', id, isActive)}
      onUpdateEngineerMapping={(engineerId, username) => console.log('Update mapping:', engineerId, username)}
      onAssignContributor={(contributorId, engineerId) => console.log('Assign contributor:', contributorId, 'to', engineerId)}
      onDismissContributor={(contributorId) => console.log('Dismiss contributor:', contributorId)}
      onManualSync={() => console.log('Manual sync triggered')}
      onRetryRepositorySync={(id) => console.log('Retry sync for repository:', id)}
    />
  )
}
