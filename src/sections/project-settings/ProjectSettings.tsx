import data from '@/../product/sections/project-settings/data.json'
import { ProjectSettings } from './components/ProjectSettings'

export default function ProjectSettingsPreview() {
  return (
    <ProjectSettings
      gitHubInstallation={data.gitHubInstallation}
      repositories={data.repositories}
      engineerMappings={data.engineerMappings}
      unmatchedContributors={data.unmatchedContributors}
      syncStatus={data.syncStatus}
      onConnectGitHub={() => console.log('Connect GitHub - redirect to GitHub App installation')}
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
