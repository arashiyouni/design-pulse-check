import { useState } from 'react'
import type { PillarScore, DeliverySubMetric, ClientSatisfaction, TeamFeedback, GrowthData } from '@/../product/sections/engineer-scorecard/types'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { Sparkline } from './Sparkline'
import { TrendBadge } from './TrendBadge'

interface PillarCardProps {
  pillar: PillarScore
  deliverySubMetrics?: DeliverySubMetric[]
  clientSatisfaction?: ClientSatisfaction
  teamFeedback?: TeamFeedback[]
  growth?: GrowthData
  onExpand?: () => void
}

const statusColors: Record<string, string> = {
  growing: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  stable: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function PillarCard({
  pillar,
  deliverySubMetrics,
  clientSatisfaction,
  teamFeedback,
  growth,
  onExpand,
}: PillarCardProps) {
  const [expanded, setExpanded] = useState(false)

  const hasExpandableContent = deliverySubMetrics || clientSatisfaction || teamFeedback || growth

  const handleToggle = () => {
    setExpanded(!expanded)
    onExpand?.()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Header — always visible */}
      <button
        onClick={hasExpandableContent ? handleToggle : undefined}
        className={`flex w-full items-center justify-between p-5 text-left ${hasExpandableContent ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {pillar.pillarName}
            </span>
            <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">
              {pillar.weight}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {pillar.score}
            </span>
            <TrendBadge trend={pillar.trend} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Sparkline data={pillar.sparkline} trend={pillar.trend} width={120} height={36} />
          {hasExpandableContent && (
            <ChevronDown
              className={`size-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && hasExpandableContent && (
        <div className="border-t border-slate-100 px-5 pb-5 dark:border-slate-800">
          {/* Delivery sub-metrics */}
          {deliverySubMetrics && (
            <div className="mt-4 space-y-3">
              {deliverySubMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {metric.name}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-lg font-semibold text-slate-900 dark:text-white">
                        {metric.value}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{metric.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkline data={metric.sparkline} trend={metric.trend} width={100} height={28} />
                    <TrendBadge trend={metric.trend} compact />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Client Satisfaction detail */}
          {clientSatisfaction && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                  <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">NPS</div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                      {clientSatisfaction.nps}/5
                    </span>
                    <Sparkline data={clientSatisfaction.npsSparkline} trend={pillar.trend} width={80} height={24} />
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                  <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">CSAT</div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                      {clientSatisfaction.csat}/5
                    </span>
                    <Sparkline data={clientSatisfaction.csatSparkline} trend={pillar.trend} width={80} height={24} />
                  </div>
                </div>
              </div>
              {clientSatisfaction.latestFeedback && (
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-1 text-xs font-medium text-slate-400 dark:text-slate-500">Latest Feedback</div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    &ldquo;{clientSatisfaction.latestFeedback}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Team Feedback detail */}
          {teamFeedback && teamFeedback.length > 0 && (
            <div className="mt-4 space-y-3">
              {teamFeedback.map((fb, i) => (
                <div key={i} className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[fb.status]}`}>
                        {fb.status}
                      </span>
                      {fb.score && (
                        <span className="font-mono text-sm font-medium text-slate-600 dark:text-slate-400">
                          {fb.score}/5
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {fb.submittedBy} &middot; {fb.submittedAt}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {fb.notes}
                  </p>
                  {fb.evidenceUrl && (
                    <a
                      href={fb.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      <ExternalLink className="size-3" />
                      Evidence
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Growth detail */}
          {growth && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                  <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Current Level</div>
                  <span className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                    {growth.currentLevel}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                  <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Growth Trajectory</div>
                  <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                    {growth.growthTrajectory}/5
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Skills Demonstrated</div>
                <div className="flex flex-wrap gap-1.5">
                  {growth.skillsDemonstrated.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target skill */}
              <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3 dark:border-teal-800 dark:bg-teal-950/30">
                <div className="mb-0.5 text-xs font-medium text-teal-600 dark:text-teal-400">Target Skill</div>
                <span className="text-sm font-medium text-teal-800 dark:text-teal-200">{growth.targetSkill}</span>
              </div>

              {/* Justification */}
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {growth.justification}
              </p>

              {/* Evidence */}
              {growth.evidenceUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {growth.evidenceUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      <ExternalLink className="size-3" />
                      Evidence {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
