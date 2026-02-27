export type AlertSeverity = 'monitor' | 'attention'
export type AlertPatternType = 'single-metric' | 'slowdown-spiral' | 'complexity-avoidance' | 'silent-struggle' | 'blocked-and-declining'
export type ActionStatus = 'open' | 'in-progress' | 'completed'
export type TrendDirection = 'improving' | 'stable' | 'declining'
export type EffectivenessVerdict = 'resolved' | 'monitoring' | 'escalated'
export type LeadCheckInStatus = 'Growing' | 'Stable' | 'Blocked'
export type CreateActionType = 'email-reminder' | 'burnout-survey' | 'quick-call' | 'follow-up-ticket'

export interface SparklinePoint {
  period: string
  value: number
}

export interface AffectedMetric {
  name: string
  currentValue: number
  threshold: number
  trend: TrendDirection
  sparkline: SparklinePoint[]
}

export interface PRInfo {
  prNumber: number
  prTitle: string
  hoursOpen: number
  prUrl: string | null
}

export interface ScoreSnapshot {
  growth: number
  delivery: number
  clientSatisfaction: number
  leadCheckIn: LeadCheckInStatus
}

export interface Alert {
  id: string
  engineerId: string
  engineerName: string
  engineerEmail?: string
  engineerAvatarUrl: string | null
  severity: AlertSeverity
  patternType: AlertPatternType
  patternName: string
  triggerDescription: string
  affectedMetrics: AffectedMetric[]
  triggeredAt: string
  acknowledged: boolean
  prInfo?: PRInfo
  scoreSnapshot?: ScoreSnapshot
}

export interface ActionItem {
  id: string
  engineerId: string
  engineerName: string
  alertId: string | null
  description: string
  status: ActionStatus
  dueDate: string
  pillar: string | null
  createdBy: string
  createdAt: string
  resolvedAt: string | null
  resolutionNote: string | null
}

export interface TimelineEntry {
  id: string
  engineerId: string
  type: 'alert-triggered' | 'action-created' | 'action-completed' | 'status-change'
  title: string
  description: string
  date: string
  severity: AlertSeverity | null
}

export interface MetricDelta {
  metricName: string
  valueAtAlert: number
  valueNow: number
  deltaPercent: number
  trend: TrendDirection
  sparkline: SparklinePoint[]
}

export interface ActionEffectiveness {
  actionId: string
  evaluatedAt: string
  verdict: EffectivenessVerdict
  effectivenessScore: number
  patternName: string
  metricDeltas: MetricDelta[]
}

export interface CreateActionFormData {
  actionType: CreateActionType
  emailSubject: string
  emailBody: string
  description: string
  dueDate: string
  pillar: string | null
}

export interface CreateActionModalContext {
  mode: 'new' | 'followup'
  engineerName: string
  engineerEmail?: string
  engineerId: string
  alertId?: string | null
  patternName?: string
  suggestedPillar?: string | null
  prInfo?: PRInfo
  scoreSnapshot?: ScoreSnapshot
  previousActionDescription?: string | null
  previousActionPillar?: string | null
  previousActionNote?: string | null
}

export interface NeedsAttentionProps {
  alerts: Alert[]
  actionItems: ActionItem[]
  timeline: TimelineEntry[]
  effectivenessData: ActionEffectiveness[]
  onViewAlertDetail?: (alertId: string) => void
  onAcknowledgeAlert?: (alertId: string) => void
  onCreateAction?: (alertId: string) => void
  onUpdateActionStatus?: (actionId: string, status: ActionStatus) => void
  onCompleteAction?: (actionId: string, resolutionNote: string) => void
  onFilterByStatus?: (status: ActionStatus | 'all') => void
  onFilterByEngineer?: (engineerId: string | 'all') => void
  onViewEffectiveness?: (actionId: string) => void
  onCreateFollowUpAction?: (actionId: string) => void
  onSubmitAction?: (data: CreateActionFormData, context: CreateActionModalContext) => void
}
