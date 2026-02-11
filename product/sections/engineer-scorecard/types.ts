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

// ── Self-Assessment Form ────────────────────────────────────────

export type SelfAssessmentStatus = 'draft' | 'submitted'

export type GrowthTrajectoryRating = 1 | 2 | 3 | 4 | 5

export const SKILL_OPTIONS = [
  'Backend Architecture',
  'Frontend (React)',
  'Database Design',
  'API Integration',
  'DevOps/CI-CD',
  'Code Review',
  'Mentoring',
  'System Design',
] as const

export type SkillOption = (typeof SKILL_OPTIONS)[number]

export const LEVEL_DEFINITIONS: Record<EngineerLevel, string> = {
  junior: 'Follows tasks, needs guidance',
  mid: 'Owns features independently',
  senior: 'Designs systems, unblocks others',
  staff: 'Architects solutions, mentors teams',
}

export const TRAJECTORY_LABELS: Record<GrowthTrajectoryRating, string> = {
  1: 'Declined',
  2: 'Same',
  3: 'Slight',
  4: 'Strong',
  5: 'Significant',
}

export interface SelfAssessmentFormData {
  period: string
  status: SelfAssessmentStatus
  skillsDemonstrated: SkillOption[]
  evidenceUrl: string
  currentLevel: EngineerLevel
  justification: string
  growthTrajectory: GrowthTrajectoryRating
  targetSkill: string
  targetPlan: string
}

export interface SelfAssessmentFormProps {
  data: SelfAssessmentFormData | null
  period: string
  onSubmit?: (data: SelfAssessmentFormData) => void
}

// ── AI Score Analysis ───────────────────────────────────────────

export interface ScoreAnalysisActionItem {
  action: string
  pillar: string
  priority: 'high' | 'medium' | 'low'
}

export interface ScoreAnalysis {
  overallAssessment: string
  strengths: string[]
  areasForImprovement: string[]
  actionItems: ScoreAnalysisActionItem[]
}

// ── Main Scorecard Props ────────────────────────────────────────

export interface EngineerScorecardProps {
  engineer: Engineer
  pulseScore: PulseScore
  periodComparison: PeriodComparison | null
  timeline: TimelineEvent[]
  selfAssessment: SelfAssessmentFormData | null
  geminiApiKey?: string
  onPeriodChange?: (period: string) => void
  onExpandPillar?: (pillarId: string) => void
  onTimelineEventClick?: (eventId: string) => void
  onSelfAssessmentSubmit?: (data: SelfAssessmentFormData) => void
  onAnalysisGenerated?: (analysis: ScoreAnalysis) => void
}
