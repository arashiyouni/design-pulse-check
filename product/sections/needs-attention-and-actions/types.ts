export type AlertSeverity = 'monitor' | 'attention'
export type AlertPatternType = 'single-metric' | 'slowdown-spiral' | 'complexity-avoidance' | 'silent-struggle' | 'blocked-and-declining'
export type ActionStatus = 'open' | 'in-progress' | 'completed'
export type TrendDirection = 'improving' | 'stable' | 'declining'

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

export interface Alert {
  id: string
  engineerId: string
  engineerName: string
  engineerAvatarUrl: string | null
  severity: AlertSeverity
  patternType: AlertPatternType
  patternName: string
  triggerDescription: string
  affectedMetrics: AffectedMetric[]
  triggeredAt: string
  acknowledged: boolean
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

export interface NeedsAttentionProps {
  alerts: Alert[]
  actionItems: ActionItem[]
  timeline: TimelineEntry[]
  onViewAlertDetail?: (alertId: string) => void
  onAcknowledgeAlert?: (alertId: string) => void
  onCreateAction?: (alertId: string) => void
  onUpdateActionStatus?: (actionId: string, status: ActionStatus) => void
  onCompleteAction?: (actionId: string, resolutionNote: string) => void
  onFilterByStatus?: (status: ActionStatus | 'all') => void
  onFilterByEngineer?: (engineerId: string | 'all') => void
}
