import data from '@/../product/sections/project-settings/data.json'
import { ProjectList } from './components/ProjectList'

export default function ProjectListPreview() {
  return (
    <ProjectList
      organizations={data.organizations}
      projects={data.projects}
      gitHubInstallation={data.gitHubInstallation}
      repositories={data.repositories}
      engineerMappings={data.engineerMappings}
      unmatchedContributors={data.unmatchedContributors}
      syncStatus={data.syncStatus}
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
