import { useState, useRef } from 'react'
import type { EngineerScorecardProps } from '@/../product/sections/engineer-scorecard/types'
import { ArrowLeftRight } from 'lucide-react'
import { PillarCard } from './PillarCard'
import { PeriodComparison } from './PeriodComparison'
import { Timeline } from './Timeline'
import { SidebarNav } from './SidebarNav'
import { OverviewDashboard } from './OverviewDashboard'
import { RadarChart } from './RadarChart'
import { PeriodSelector } from './PeriodSelector'
import { SelfAssessmentModal } from './SelfAssessmentModal'
import { FloatingActionButton } from './FloatingActionButton'
import { ScoreAnalysisCard } from './ScoreAnalysisCard'

export function EngineerScorecard({
  engineer,
  pulseScore,
  periodComparison,
  timeline,
  selfAssessment,
  onPeriodChange,
  onExpandPillar,
  onTimelineEventClick,
  onSelfAssessmentSubmit,
  geminiApiKey,
  onAnalysisGenerated,
}: EngineerScorecardProps) {
  const [activeSection, setActiveSection] = useState('overview')
  const [showComparison, setShowComparison] = useState(false)
  const [activePillarTab, setActivePillarTab] = useState(0)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)

  // Refs for scrolling
  const overviewRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Map pillar IDs to their detail data
  const pillarDetails: Record<string, {
    deliverySubMetrics?: typeof pulseScore.deliverySubMetrics
    clientSatisfaction?: typeof pulseScore.clientSatisfaction
    teamFeedback?: typeof pulseScore.teamFeedback
    growth?: typeof pulseScore.growth
  }> = {
    delivery: { deliverySubMetrics: pulseScore.deliverySubMetrics },
    'client-satisfaction': { clientSatisfaction: pulseScore.clientSatisfaction },
    'team-feedback': { teamFeedback: pulseScore.teamFeedback },
    growth: { growth: pulseScore.growth },
  }



  // Completion status
  const completionStatus = {
    delivery: pulseScore.deliverySubMetrics.length > 0,
    clientSatisfaction: !!pulseScore.clientSatisfaction,
    teamFeedback: pulseScore.teamFeedback.length > 0,
    growth: !!pulseScore.growth,
    assessment: selfAssessment?.status === 'submitted',
    timeline: timeline.length > 0,
  }

  // Handle navigation
  const handleNavigate = (section: string) => {
    setActiveSection(section)
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      overview: overviewRef,
      pillars: pillarsRef,
      timeline: timelineRef,
    }
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif] dark:bg-slate-950">
      {/* ── Sticky Header ───────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              {engineer.avatarUrl ? (
                <img
                  src={engineer.avatarUrl}
                  alt={engineer.name}
                  className="size-12 rounded-full border-2 border-white shadow-sm dark:border-slate-800"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {engineer.name.split(' ').map((n) => n[0]).join('')}
                </div>
              )}

              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{engineer.name}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="capitalize">{engineer.level} Engineer</span>
                  <span className="text-slate-300 dark:text-slate-600">&middot;</span>
                  <span>{engineer.project}</span>
                  <span className="text-slate-300 dark:text-slate-600">&middot;</span>
                  <span className="font-mono text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {pulseScore.compositeScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Period selector */}
            <div className="flex items-center gap-2">
              <PeriodSelector
                currentPeriod={engineer.currentPeriod}
                onPeriodChange={onPeriodChange}
              />
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  showComparison
                    ? 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <ArrowLeftRight className="size-3.5" />
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout with Sidebar ────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <SidebarNav
              activeSection={activeSection}
              onNavigate={handleNavigate}
              completionStatus={completionStatus}
            />
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1 space-y-6">
            {/* ── Overview Section ──────────────────────────────── */}
            <section ref={overviewRef} id="overview">
              <OverviewDashboard
                compositeScore={pulseScore.compositeScore}
                trend={pulseScore.trend}
                pillars={pulseScore.pillars}
                period={engineer.currentPeriod}
              />

              {/* Radar Chart + AI Score Analysis */}
              <div className={`mt-4 grid gap-4 ${geminiApiKey ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <RadarChart pillars={pulseScore.pillars} />
                {geminiApiKey && (
                  <ScoreAnalysisCard
                    engineer={engineer}
                    pulseScore={pulseScore}
                    apiKey={geminiApiKey}
                    onAnalysisGenerated={onAnalysisGenerated}
                  />
                )}
              </div>

              {/* Period Comparison */}
              {showComparison && periodComparison && (
                <div className="mt-4">
                  <PeriodComparison comparison={periodComparison} />
                </div>
              )}
            </section>

            {/* ── Pillar Details Section ───────────────────────── */}
            <section ref={pillarsRef} id="pillars">
              <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-800">
                  <div className="flex overflow-x-auto">
                    {pulseScore.pillars.map((pillar, index) => (
                      <button
                        key={pillar.pillarId}
                        onClick={() => setActivePillarTab(index)}
                        className={`flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                          activePillarTab === index
                            ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                            : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        {pillar.pillarName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <PillarCard
                    pillar={pulseScore.pillars[activePillarTab]}
                    onExpand={() => onExpandPillar?.(pulseScore.pillars[activePillarTab].pillarId)}
                    {...pillarDetails[pulseScore.pillars[activePillarTab].pillarId]}
                  />
                </div>
              </div>
            </section>


            {/* ── Timeline Section ──────────────────────────────── */}
            <section ref={timelineRef} id="timeline">
              <Timeline events={timeline} onEventClick={onTimelineEventClick} />
            </section>
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsAssessmentModalOpen(true)}
        hasAssessment={selfAssessment?.status === 'submitted'}
      />

      {/* Self-Assessment Modal */}
      <SelfAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        period={engineer.currentPeriod}
        existingData={selfAssessment}
        onSubmit={onSelfAssessmentSubmit}
      />
    </div>
  )
}
