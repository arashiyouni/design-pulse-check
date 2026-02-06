export type TrendDirection = 'improving' | 'stable' | 'declining'
export type AttentionStatus = 'healthy' | 'monitor' | 'attention'
export type EngineerLevel = 'junior' | 'mid' | 'senior' | 'staff'

export interface SparklinePoint {
  period: string
  value: number
}

export interface SummaryStats {
  totalEngineers: number
  totalDelta: number
  healthy: number
  healthyDelta: number
  monitor: number
  monitorDelta: number
  needsAttention: number
  needsAttentionDelta: number
}

export interface PillarMiniSparkline {
  pillarId: string
  pillarName: string
  score: number
  trend: TrendDirection
  sparkline: SparklinePoint[]
}

export interface RosterEngineer {
  id: string
  name: string
  avatarUrl: string | null
  project: string
  level: EngineerLevel
  compositeScore: number
  overallTrend: TrendDirection
  attentionStatus: AttentionStatus
  pillars: PillarMiniSparkline[]
}

export interface PillarWeight {
  pillarId: string
  pillarName: string
  weight: number
}

export interface TrendGroup {
  trend: TrendDirection
  label: string
  count: number
  engineers: RosterEngineer[]
}

export interface FilterOptions {
  projects: string[]
  levels: EngineerLevel[]
  trends: TrendDirection[]
  statuses: AttentionStatus[]
}

export interface PortfolioViewProps {
  summaryStats: SummaryStats
  roster: RosterEngineer[]
  pillarWeights: PillarWeight[]
  trendGroups: TrendGroup[]
  filterOptions: FilterOptions
  currentPeriod: string
  previousPeriod: string
  onEngineerClick?: (engineerId: string) => void
  onFilterChange?: (filters: Partial<FilterOptions>) => void
  onSearchChange?: (query: string) => void
  onWeightChange?: (pillarId: string, weight: number) => void
  onPeriodToggle?: (period: string) => void
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void
}
