import type { PillarScore, TrendDirection } from '@/../product/sections/engineer-scorecard/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface OverviewDashboardProps {
  compositeScore: number
  trend: TrendDirection
  pillars: PillarScore[]
  period: string
}

const trendConfig = {
  improving: { icon: TrendingUp, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40' },
  stable: { icon: Minus, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/40' },
  declining: { icon: TrendingDown, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
}

export function OverviewDashboard({ compositeScore, trend, pillars, period }: OverviewDashboardProps) {
  const TrendIcon = trendConfig[trend].icon

  return (
    <div className="space-y-4">
      {/* Composite Score Card */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Composite Pulse Score
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-5xl font-bold text-slate-900 dark:text-white">
                {compositeScore}
              </span>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendConfig[trend].bg} ${trendConfig[trend].color}`}>
                <TrendIcon className="size-3.5" />
                <span className="capitalize">{trend}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Weighted average of 4 pillars · {period}
            </p>
          </div>
          
          {/* Score Ring Visual */}
          <div className="relative">
            <svg width="100" height="100" viewBox="0 0 100 100" className="rotate-[-90deg]">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100 dark:text-slate-800"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(compositeScore / 100) * 251.2} 251.2`}
                className="text-teal-500 dark:text-teal-400"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {compositeScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Quick View Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {pillars.map((pillar) => {
          const pillarTrend = trendConfig[pillar.trend]
          const PillarIcon = pillarTrend.icon
          
          return (
            <div
              key={pillar.pillarId}
              className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {pillar.pillarName}
                </span>
                <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">
                  {pillar.weight}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                  {pillar.score}
                </span>
                <PillarIcon className={`size-4 ${pillarTrend.color}`} />
              </div>
              
              {/* Mini sparkline */}
              <div className="mt-2 h-6">
                <svg width="100%" height="24" className="overflow-visible">
                  <polyline
                    points={pillar.sparkline
                      .map((point, i) => {
                        const x = (i / (pillar.sparkline.length - 1)) * 100
                        const y = 24 - (point.value / 100) * 24
                        return `${x},${y}`
                      })
                      .join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={pillarTrend.color}
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
