export type TrendDirection = 'improving' | 'stable' | 'declining'
export type EngineerLevel = 'junior' | 'mid' | 'senior' | 'staff'
export type LeadStatus = 'growing' | 'stable' | 'blocked'

export interface SparklinePoint {
  period: string
  value: number
}

export interface PillarScore {
  pillarId: string
  pillarName: string
  score: number
  trend: TrendDirection
  sparkline: SparklinePoint[]
  weight: number
}

export interface DeliverySubMetric {
  id: string
  name: string
  value: number
  unit: string
  score: number
  trend: TrendDirection
  sparkline: SparklinePoint[]
}

export interface ClientSatisfaction {
  nps: number
  csat: number
  npsSparkline: SparklinePoint[]
  csatSparkline: SparklinePoint[]
  latestFeedback: string | null
}

export interface TeamFeedback {
  status: LeadStatus
  score: number | null
  notes: string
  evidenceUrl: string | null
  submittedBy: string
  submittedAt: string
}

export interface GrowthData {
  currentLevel: EngineerLevel
  skillsDemonstrated: string[]
  growthTrajectory: number
  evidenceUrls: string[]
  targetSkill: string
  justification: string
}

export interface TimelineEvent {
  id: string
  type: 'survey' | 'check-in' | 'self-assessment' | 'alert' | 'action-item'
  title: string
  description: string
  date: string
  pillar: string | null
}

export interface Engineer {
  id: string
  name: string
  avatarUrl: string | null
  level: EngineerLevel
  project: string
  currentPeriod: string
}

export interface PulseScore {
  compositeScore: number
  trend: TrendDirection
  pillars: PillarScore[]
  deliverySubMetrics: DeliverySubMetric[]
  clientSatisfaction: ClientSatisfaction
  teamFeedback: TeamFeedback[]
  growth: GrowthData
}

export interface PeriodComparison {
  currentPeriod: string
  previousPeriod: string
  currentScore: number
  previousScore: number
  delta: number
  pillarDeltas: { pillarName: string; current: number; previous: number; delta: number }[]
}

export interface EngineerScorecardProps {
  engineer: Engineer
  pulseScore: PulseScore
  periodComparison: PeriodComparison | null
  timeline: TimelineEvent[]
  onPeriodChange?: (period: string) => void
  onExpandPillar?: (pillarId: string) => void
  onTimelineEventClick?: (eventId: string) => void
}
