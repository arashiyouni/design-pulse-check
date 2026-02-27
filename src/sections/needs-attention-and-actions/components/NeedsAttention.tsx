import { useState } from 'react'
import type {
  NeedsAttentionProps,
  CreateActionModalContext,
  AlertPatternType,
} from '@/../product/sections/needs-attention-and-actions/types'
import { AlertTriangle, ListChecks, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { AlertCard } from './AlertCard'
import { ActionItemsTable } from './ActionItemsTable'
import { HistoryTimeline } from './HistoryTimeline'
import { ActionEffectivenessList } from './ActionEffectivenessList'
import { ActionEffectivenessPanel } from './ActionEffectivenessPanel'
import { CreateActionModal } from './CreateActionModal'

type TabId = 'alerts' | 'actions' | 'timeline' | 'effectiveness'

const patternPillar: Partial<Record<AlertPatternType, string>> = {
  'slowdown-spiral': 'Delivery',
  'single-metric': 'Delivery',
  'complexity-avoidance': 'Delivery',
  'silent-struggle': 'Growth',
  'blocked-and-declining': 'Delivery',
}

export function NeedsAttention({
  alerts,
  actionItems,
  timeline,
  effectivenessData,
  onViewAlertDetail,
  onAcknowledgeAlert,
  onCreateAction,
  onUpdateActionStatus,
  onCompleteAction,
  onFilterByStatus,
  onFilterByEngineer,
  onViewEffectiveness,
  onCreateFollowUpAction,
  onSubmitAction,
}: NeedsAttentionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('alerts')
  const [selectedEffectivenessId, setSelectedEffectivenessId] = useState<string | null>(null)
  const [actionModalContext, setActionModalContext] =
    useState<CreateActionModalContext | null>(null)

  const attentionCount = alerts.filter((a) => a.severity === 'attention').length
  const monitorCount = alerts.filter((a) => a.severity === 'monitor').length
  const openActions = actionItems.filter((a) => a.status !== 'completed').length

  // Open modal from alert card
  const handleCreateAction = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert) return
    setActionModalContext({
      mode: 'new',
      engineerName: alert.engineerName,
      engineerEmail: alert.engineerEmail,
      engineerId: alert.engineerId,
      alertId: alert.id,
      patternName: alert.patternName,
      suggestedPillar: patternPillar[alert.patternType] ?? null,
      prInfo: alert.prInfo,
      scoreSnapshot: alert.scoreSnapshot,
    })
    onCreateAction?.(alertId)
  }

  // Open modal in follow-up mode from effectiveness panel
  const handleCreateFollowUpAction = (actionId: string) => {
    const item = actionItems.find((a) => a.id === actionId)
    if (!item) return
    const eff = effectivenessData.find((e) => e.actionId === actionId)
    // Try to get engineer email from a linked alert
    const linkedAlert = item.alertId ? alerts.find((a) => a.id === item.alertId) : null
    setActionModalContext({
      mode: 'followup',
      engineerName: item.engineerName,
      engineerEmail: linkedAlert?.engineerEmail,
      engineerId: item.engineerId,
      alertId: item.alertId,
      patternName: eff?.patternName,
      previousActionPillar: item.pillar,
      suggestedPillar: item.pillar,
      prInfo: linkedAlert?.prInfo,
      scoreSnapshot: linkedAlert?.scoreSnapshot,
      previousActionDescription: item.description,
      previousActionNote: item.resolutionNote,
    })
    onCreateFollowUpAction?.(actionId)
  }

  const handleViewEffectiveness = (actionId: string) => {
    setSelectedEffectivenessId(actionId)
    setActiveTab('effectiveness')
    onViewEffectiveness?.(actionId)
  }

  const selectedEffectiveness = selectedEffectivenessId
    ? effectivenessData.find((e) => e.actionId === selectedEffectivenessId) ?? null
    : null

  const selectedActionItem = selectedEffectivenessId
    ? actionItems.find((a) => a.id === selectedEffectivenessId) ?? null
    : null

  const tabs: {
    id: TabId
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
  }[] = [
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: alerts.length },
    { id: 'actions', label: 'Action Items', icon: ListChecks, badge: openActions },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'effectiveness', label: 'Effectiveness', icon: TrendingUp, badge: effectivenessData.length },
  ]

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Needs Attention</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {alerts.length === 0
              ? 'All clear — no attention flags this period'
              : `${attentionCount} attention, ${monitorCount} monitor flags active`}
          </p>
        </div>

        {/* ── Summary badges ────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/30">
            <AlertTriangle className="size-4 text-red-500 dark:text-red-400" />
            <span className="font-mono text-lg font-bold text-red-700 dark:text-red-300">
              {attentionCount}
            </span>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Attention</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
            <AlertTriangle className="size-4 text-amber-500 dark:text-amber-400" />
            <span className="font-mono text-lg font-bold text-amber-700 dark:text-amber-300">
              {monitorCount}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Monitor</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 dark:bg-teal-950/30">
            <CheckCircle2 className="size-4 text-teal-500 dark:text-teal-400" />
            <span className="font-mono text-lg font-bold text-teal-700 dark:text-teal-300">
              {actionItems.filter((a) => a.status === 'completed').length}
            </span>
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Resolved</span>
          </div>
        </div>

        {/* ── Tab navigation ────────────────────────────────────── */}
        <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== 'effectiveness') setSelectedEffectivenessId(null)
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === tab.id
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Tab Content ───────────────────────────────────────── */}
        {activeTab === 'alerts' && (
          <div>
            {alerts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
                <CheckCircle2 className="mx-auto mb-3 size-10 text-teal-300 dark:text-teal-700" />
                <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
                  All clear
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No attention flags this period. Great work!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts
                  .sort((a, b) => {
                    if (a.severity === 'attention' && b.severity !== 'attention') return -1
                    if (a.severity !== 'attention' && b.severity === 'attention') return 1
                    return 0
                  })
                  .map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onViewDetail={() => onViewAlertDetail?.(alert.id)}
                      onAcknowledge={() => onAcknowledgeAlert?.(alert.id)}
                      onCreateAction={() => handleCreateAction(alert.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <ActionItemsTable
            actionItems={actionItems}
            effectivenessData={effectivenessData}
            onUpdateStatus={onUpdateActionStatus}
            onComplete={onCompleteAction}
            onFilterByStatus={onFilterByStatus}
            onFilterByEngineer={onFilterByEngineer}
            onViewEffectiveness={handleViewEffectiveness}
          />
        )}

        {activeTab === 'timeline' && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Activity History
            </h3>
            <HistoryTimeline entries={timeline} />
          </div>
        )}

        {activeTab === 'effectiveness' && (
          <div>
            {selectedEffectiveness && selectedActionItem ? (
              <ActionEffectivenessPanel
                effectiveness={selectedEffectiveness}
                actionItem={selectedActionItem}
                onBack={() => setSelectedEffectivenessId(null)}
                onCreateFollowUpAction={handleCreateFollowUpAction}
              />
            ) : (
              <ActionEffectivenessList
                effectivenessData={effectivenessData}
                actionItems={actionItems}
                onViewDetail={(actionId) => setSelectedEffectivenessId(actionId)}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Create Action Modal ────────────────────────────────── */}
      <CreateActionModal
        context={actionModalContext}
        onClose={() => setActionModalContext(null)}
        onSubmit={(data, ctx) => {
          onSubmitAction?.(data, ctx)
          setActionModalContext(null)
        }}
      />
    </>
  )
}
