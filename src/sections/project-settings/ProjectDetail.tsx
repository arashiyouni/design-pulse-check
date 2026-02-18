import data from '@/../product/sections/project-settings/data.json'
import { ProjectDetail } from './components/ProjectDetail'

export default function ProjectDetailPreview() {
  // Use the first project (Acme Marketplace Rebuild) which has both GitHub and Jira connected
  const project = data.projects[0]

  return (
    <ProjectDetail
      project={project}
      gitHubInstallation={data.gitHubInstallation}
      repositories={data.repositories}
      engineerMappings={data.engineerMappings}
      unmatchedContributors={data.unmatchedContributors}
      syncStatus={data.syncStatus}
      onBack={() => console.log('Back to project list')}
      onEditProject={(id, updates) => console.log('Edit project:', id, updates)}
      onConnectIntegration={(projectId, type) => console.log('Connect integration:', projectId, type)}
      onDisconnectIntegration={(projectId, integrationId) => console.log('Disconnect integration:', projectId, integrationId)}
      onConnectGitHub={() => console.log('Connect GitHub App')}
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
