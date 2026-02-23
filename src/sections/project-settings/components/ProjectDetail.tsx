import { useState } from 'react'
import type {
  Project,
  Integration,
  GitHubInstallation,
  GitHubRepository,
  EngineerGitHubMapping,
  UnmatchedContributor,
  SyncStatus,
} from '@/../product/sections/project-settings/types'
import { ArrowLeft, Building2, Zap, Users, Settings, Puzzle, Pencil } from 'lucide-react'
import { IntegrationCard } from './IntegrationCard'
import { ProjectSettings } from './ProjectSettings'

type TabId = 'integrations' | 'github-detail' | 'jira-detail' | 'linear-detail'

interface ProjectDetailProps {
  project: Project
  gitHubInstallation: GitHubInstallation
  repositories: GitHubRepository[]
  engineerMappings: EngineerGitHubMapping[]
  unmatchedContributors: UnmatchedContributor[]
  syncStatus: SyncStatus
  onBack?: () => void
  onEditProject?: (projectId: string, updates: Record<string, unknown>) => void
  onConnectIntegration?: (projectId: string, type: 'github' | 'jira' | 'linear') => void
  onDisconnectIntegration?: (projectId: string, integrationId: string) => void
  onConnectGitHub?: () => void
  onDisconnectGitHub?: () => void
  onLinkRepository?: (repositoryId: string) => void
  onUnlinkRepository?: (repositoryId: string) => void
  onUpdateEngineerMapping?: (engineerId: string, githubUsername: string) => void
  onAssignContributor?: (contributorId: string, engineerId: string) => void
  onDismissContributor?: (contributorId: string) => void
  onManualSync?: () => void
  onRetryRepositorySync?: (repositoryId: string) => void
}

const integrationTypes = ['github', 'jira', 'linear'] as const

export function ProjectDetail({
  project,
  gitHubInstallation,
  repositories,
  engineerMappings,
  unmatchedContributors,
  syncStatus,
  onBack,
  onEditProject,
  onConnectIntegration,
  onDisconnectIntegration,
  onConnectGitHub,
  onDisconnectGitHub,
  onLinkRepository,
  onUnlinkRepository,
  onUpdateEngineerMapping,
  onAssignContributor,
  onDismissContributor,
  onManualSync,
  onRetryRepositorySync,
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>('integrations')

  const getIntegration = (type: string): Integration | undefined =>
    project.integrations.find((i) => i.type === type)

  const connectedCount = project.integrations.filter((i) => i.status === 'connected').length
  const errorCount = project.integrations.filter((i) => i.status === 'error').length
  const leadEngineer = project.engineers.find((e) => e.role === 'lead')

  // Renders the GitHub detail using the existing ProjectSettings component
  if (activeTab === 'github-detail') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
        {/* Back to integrations */}
        <button
          onClick={() => setActiveTab('integrations')}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <ArrowLeft className="size-4" />
          Back to Integrations
        </button>
        <ProjectSettings
          gitHubInstallation={gitHubInstallation}
          repositories={repositories}
          engineerMappings={engineerMappings}
          unmatchedContributors={unmatchedContributors}
          syncStatus={syncStatus}
          onConnectGitHub={onConnectGitHub}
          onDisconnectGitHub={onDisconnectGitHub}
          currentProjectId={project.id}
          onLinkRepository={onLinkRepository}
          onUnlinkRepository={onUnlinkRepository}
          onUpdateEngineerMapping={onUpdateEngineerMapping}
          onAssignContributor={onAssignContributor}
          onDismissContributor={onDismissContributor}
          onManualSync={onManualSync}
          onRetryRepositorySync={onRetryRepositorySync}
        />
      </div>
    )
  }

  // Jira or Linear detail placeholder
  if (activeTab === 'jira-detail' || activeTab === 'linear-detail') {
    const detailType = activeTab === 'jira-detail' ? 'jira' : 'linear'
    const detailLabel = detailType === 'jira' ? 'Jira' : 'Linear'
    const integration = getIntegration(detailType)

    return (
      <div className="mx-auto max-w-7xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
        <button
          onClick={() => setActiveTab('integrations')}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <ArrowLeft className="size-4" />
          Back to Integrations
        </button>

        {integration?.status === 'connected' ? (
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <div className={`flex size-12 items-center justify-center rounded-xl shadow-lg ${
                detailType === 'jira' ? 'bg-blue-600' : 'bg-violet-600'
              }`}>
                {detailType === 'jira' ? (
                  <svg className="size-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005z" />
                    <path d="M5.024 5.958H16.59a5.218 5.218 0 00-5.232-5.215H9.228V-1.314A5.215 5.215 0 004.019 4.958v.995a1.005 1.005 0 001.005 1.005z" opacity=".65" />
                    <path d="M16.59 5.958a5.218 5.218 0 00-5.232 5.215v2.057a5.215 5.215 0 005.215 5.257V6.963a1.005 1.005 0 00-1.005-1.005H16.59z" opacity=".35" />
                  </svg>
                ) : (
                  <svg className="size-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.088 15.32a11.998 11.998 0 006.592 6.592L2.088 15.32zM1.003 12.96a12.02 12.02 0 001.517 5.243l6.72 6.72A12.02 12.02 0 0014.48 26.44L1.003 12.96zM3.47 6.23A12 12 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0a12 12 0 00-8.53 3.53l14.06 14.06A7.5 7.5 0 1012 4.5a7.48 7.48 0 00-5.34 2.22L3.47 6.23z" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{detailLabel} Integration</h1>
                <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{integration.externalProjectName}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-teal-500" />
                  <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Connected</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Synced Items</div>
                <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {integration.syncedItemCount.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Last Sync</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {integration.lastSyncAt
                    ? new Date(integration.lastSyncAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                    : '—'}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/30">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-200/80 dark:bg-slate-700">
                <Settings className="size-7 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                Detailed {detailLabel} Configuration
              </h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Ticket mapping, sprint sync settings, and advanced configuration for {detailLabel} will be available in a future update.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Puzzle className="size-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
              {detailLabel} Not Connected
            </h3>
            <p className="mb-4 max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
              Connect {detailLabel} from the integrations tab to start syncing ticket data.
            </p>
            <button
              onClick={() => setActiveTab('integrations')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              Go to Integrations
            </button>
          </div>
        )}
      </div>
    )
  }

  // Main integrations tab
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        <ArrowLeft className="size-4" />
        All Projects
      </button>

      {/* Project header */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/10 to-teal-600/10 dark:from-teal-400/10 dark:to-teal-500/10">
              {project.type === 'internal' ? (
                <Zap className="size-6 text-teal-600 dark:text-teal-400" />
              ) : (
                <Building2 className="size-6 text-teal-600 dark:text-teal-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                {project.type === 'internal' && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    Internal
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {project.organizationName ?? 'Ravn'} &middot; Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
              {project.description && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onEditProject?.(project.id, {})}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>
        </div>

        {/* Team summary */}
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{project.engineerCount}</span> engineers
            </span>
          </div>
          {leadEngineer && (
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-teal-100 text-[9px] font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                {leadEngineer.engineerName.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {leadEngineer.engineerName} <span className="text-slate-400 dark:text-slate-500">(Lead)</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Puzzle className="size-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{connectedCount}</span> integration{connectedCount !== 1 ? 's' : ''} connected
              {errorCount > 0 && (
                <span className="ml-1 text-red-500">({errorCount} error{errorCount !== 1 ? 's' : ''})</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Integrations section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Integrations</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {connectedCount} of {integrationTypes.length} connected
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrationTypes.map((type) => {
          const integration = getIntegration(type)
          return (
            <IntegrationCard
              key={type}
              type={type}
              integration={integration}
              onConnect={() => onConnectIntegration?.(project.id, type)}
              onManage={() => setActiveTab(`${type}-detail` as TabId)}
              onDisconnect={() => {
                if (integration) {
                  onDisconnectIntegration?.(project.id, integration.id)
                }
              }}
            />
          )
        })}
      </div>

      {/* Engineer roster */}
      <div className="mt-8">
        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Team</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {project.engineers.map((eng, idx) => (
            <div
              key={eng.engineerId}
              className={`flex items-center justify-between px-4 py-3 ${
                idx < project.engineers.length - 1 ? 'border-b border-slate-50 dark:border-slate-800/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {eng.engineerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{eng.engineerName}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{eng.level}</div>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                eng.role === 'lead'
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {eng.role === 'lead' ? 'Lead' : 'Engineer'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
