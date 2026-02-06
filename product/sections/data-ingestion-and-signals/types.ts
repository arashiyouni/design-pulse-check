export type IntegrationStatus = 'connected' | 'disconnected' | 'error'
export type HealthStatus = 'healthy' | 'warning' | 'error'
export type SurveyStatus = 'draft' | 'sent' | 'completed'
export type LeadStatus = 'growing' | 'stable' | 'blocked'
export type EngineerLevel = 'junior' | 'mid' | 'senior' | 'staff'
export type SignalType = 'delivery' | 'survey' | 'check-in' | 'self-assessment'

export interface Integration {
  id: string
  name: string
  type: 'github' | 'jira' | 'linear'
  status: IntegrationStatus
  lastSyncAt: string | null
  repoCount: number
  projectCount: number
  errorMessage: string | null
}

export interface IngestionHealth {
  source: string
  status: HealthStatus
  lastSuccessfulSync: string
  recordsThisPeriod: number
  errorCount: number
}

export interface SurveyCampaign {
  id: string
  name: string
  period: string
  status: SurveyStatus
  engineerCount: number
  responseCount: number
  responseRate: number
  sentAt: string | null
  completedAt: string | null
}

export interface SurveyResponse {
  id: string
  engineerName: string
  nps: number
  csat: number
  feedback: string | null
  submittedAt: string
}

export interface LeadCheckInForm {
  engineerId: string
  engineerName: string
  status: LeadStatus
  score: number | null
  notes: string
  evidenceUrl: string | null
}

export interface SelfAssessmentForm {
  engineerId: string
  skillsDemonstrated: string[]
  currentLevel: EngineerLevel
  levelJustification: string
  growthTrajectory: number
  evidenceUrls: string[]
  targetSkill: string
}

export interface SignalActivity {
  id: string
  type: SignalType
  submittedBy: string
  engineerName: string
  preview: string
  submittedAt: string
}

export interface EngineerOption {
  id: string
  name: string
  project: string
  level: EngineerLevel
}

export interface DataIngestionProps {
  integrations: Integration[]
  ingestionHealth: IngestionHealth[]
  surveyCampaigns: SurveyCampaign[]
  recentSurveyResponses: SurveyResponse[]
  signalActivity: SignalActivity[]
  engineers: EngineerOption[]
  onConnectIntegration?: (type: 'github' | 'jira' | 'linear') => void
  onDisconnectIntegration?: (id: string) => void
  onSyncIntegration?: (id: string) => void
  onCreateSurvey?: () => void
  onSendSurvey?: (id: string) => void
  onSubmitCheckIn?: (data: LeadCheckInForm) => void
  onSubmitSelfAssessment?: (data: SelfAssessmentForm) => void
}
