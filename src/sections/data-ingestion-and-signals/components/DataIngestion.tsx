import { useState } from 'react'
import type { DataIngestionProps } from '@/../product/sections/data-ingestion-and-signals/types'
import { Plug, Activity, MessageSquare, UserCheck, Sparkles, Radio } from 'lucide-react'
import { IntegrationCards } from './IntegrationCards'
import { IngestionHealthDashboard } from './IngestionHealthDashboard'
import { SurveyManagement } from './SurveyManagement'
import { LeadCheckInForm } from './LeadCheckInForm'
import { SelfAssessmentForm } from './SelfAssessmentForm'
import { SignalActivityLog } from './SignalActivityLog'

type TabId = 'integrations' | 'health' | 'surveys' | 'check-in' | 'self-assessment' | 'activity'

export function DataIngestion({
  integrations,
  ingestionHealth,
  surveyCampaigns,
  recentSurveyResponses,
  signalActivity,
  engineers,
  onConnectIntegration,
  onDisconnectIntegration,
  onSyncIntegration,
  onCreateSurvey,
  onSendSurvey,
  onSubmitCheckIn,
  onSubmitSelfAssessment,
}: DataIngestionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('integrations')

  const tabs: { id: TabId; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'integrations', label: 'Integrations', shortLabel: 'Integrations', icon: Plug },
    { id: 'health', label: 'Ingestion Health', shortLabel: 'Health', icon: Activity },
    { id: 'surveys', label: 'Surveys', shortLabel: 'Surveys', icon: MessageSquare },
    { id: 'check-in', label: 'Lead Check-In', shortLabel: 'Check-In', icon: UserCheck },
    { id: 'self-assessment', label: 'Self-Assessment', shortLabel: 'Self-Assess', icon: Sparkles },
    { id: 'activity', label: 'Signal Activity', shortLabel: 'Activity', icon: Radio },
  ]

  const connectedCount = integrations.filter((i) => i.status === 'connected').length
  const healthyCount = ingestionHealth.filter((h) => h.status === 'healthy').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Data Ingestion & Signals</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {connectedCount} integrations connected · {healthyCount}/{ingestionHealth.length} sources healthy · {signalActivity.length} recent signals
        </p>
      </div>

      {/* ── Tab navigation ────────────────────────────────────── */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────── */}
      {activeTab === 'integrations' && (
        <IntegrationCards
          integrations={integrations}
          onConnect={onConnectIntegration}
          onDisconnect={onDisconnectIntegration}
          onSync={onSyncIntegration}
        />
      )}

      {activeTab === 'health' && (
        <IngestionHealthDashboard healthData={ingestionHealth} />
      )}

      {activeTab === 'surveys' && (
        <SurveyManagement
          campaigns={surveyCampaigns}
          recentResponses={recentSurveyResponses}
          onCreateSurvey={onCreateSurvey}
          onSendSurvey={onSendSurvey}
        />
      )}

      {activeTab === 'check-in' && (
        <LeadCheckInForm engineers={engineers} onSubmit={onSubmitCheckIn} />
      )}

      {activeTab === 'self-assessment' && (
        <SelfAssessmentForm engineers={engineers} onSubmit={onSubmitSelfAssessment} />
      )}

      {activeTab === 'activity' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Signal Activity Feed</h3>
          <SignalActivityLog activities={signalActivity} />
        </div>
      )}
    </div>
  )
}
