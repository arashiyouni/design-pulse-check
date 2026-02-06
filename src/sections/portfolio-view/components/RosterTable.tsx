import type { RosterEngineer, TrendDirection, AttentionStatus } from '@/../product/sections/portfolio-view/types'
import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown } from 'lucide-react'
import { MiniSparkline } from './MiniSparkline'

const trendBadge: Record<TrendDirection, { icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  improving: { icon: TrendingUp, classes: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300' },
  stable: { icon: Minus, classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  declining: { icon: TrendingDown, classes: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300' },
}

const statusBadge: Record<AttentionStatus, string> = {
  healthy: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
  monitor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  attention: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
}

interface RosterTableProps {
  engineers: RosterEngineer[]
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onEngineerClick?: (id: string) => void
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void
}

function SortHeader({
  label,
  column,
  currentSort,
  currentDirection,
  onSort,
  className = '',
}: {
  label: string
  column: string
  currentSort: string
  currentDirection: 'asc' | 'desc'
  onSort?: (col: string, dir: 'asc' | 'desc') => void
  className?: string
}) {
  const active = currentSort === column
  return (
    <button
      onClick={() => onSort?.(column, active && currentDirection === 'asc' ? 'desc' : 'asc')}
      className={`group flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 ${className}`}
    >
      {label}
      <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
        {active && currentDirection === 'desc' ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronUp className="size-3" />
        )}
      </span>
    </button>
  )
}

export function RosterTable({
  engineers,
  sortColumn,
  sortDirection,
  onEngineerClick,
  onSortChange,
}: RosterTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-3 text-left">
                <SortHeader label="Engineer" column="name" currentSort={sortColumn} currentDirection={sortDirection} onSort={onSortChange} />
              </th>
              <th className="px-3 py-3 text-left">
                <SortHeader label="Project" column="project" currentSort={sortColumn} currentDirection={sortDirection} onSort={onSortChange} />
              </th>
              <th className="px-3 py-3 text-right">
                <SortHeader label="Score" column="compositeScore" currentSort={sortColumn} currentDirection={sortDirection} onSort={onSortChange} className="justify-end" />
              </th>
              <th className="px-3 py-3 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Client</span>
              </th>
              <th className="px-3 py-3 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Team</span>
              </th>
              <th className="px-3 py-3 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Growth</span>
              </th>
              <th className="px-3 py-3 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Delivery</span>
              </th>
              <th className="px-3 py-3 text-center">
                <SortHeader label="Trend" column="overallTrend" currentSort={sortColumn} currentDirection={sortDirection} onSort={onSortChange} className="justify-center" />
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {engineers.map((eng) => {
              const trend = trendBadge[eng.overallTrend]
              const TrendIcon = trend.icon

              return (
                <tr
                  key={eng.id}
                  onClick={() => onEngineerClick?.(eng.id)}
                  className="cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/50 last:border-0 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
                >
                  {/* Name + avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {eng.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{eng.name}</div>
                        <div className="text-xs capitalize text-slate-400 dark:text-slate-500">{eng.level}</div>
                      </div>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-400">{eng.project}</td>

                  {/* Score */}
                  <td className="px-3 py-3 text-right font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {eng.compositeScore}
                  </td>

                  {/* 4 mini sparklines */}
                  {eng.pillars.map((p) => (
                    <td key={p.pillarId} className="px-3 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <MiniSparkline data={p.sparkline} trend={p.trend} width={80} height={20} />
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{p.score}</span>
                      </div>
                    </td>
                  ))}

                  {/* Trend */}
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${trend.classes}`}>
                      <TrendIcon className="size-3" />
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[eng.attentionStatus]}`}>
                      {eng.attentionStatus}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 lg:hidden">
        {engineers.map((eng) => {
          const trend = trendBadge[eng.overallTrend]
          const TrendIcon = trend.icon

          return (
            <button
              key={eng.id}
              onClick={() => onEngineerClick?.(eng.id)}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {eng.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{eng.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{eng.project} &middot; <span className="capitalize">{eng.level}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${trend.classes}`}>
                    <TrendIcon className="size-3" />
                  </span>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[eng.attentionStatus]}`}>
                    {eng.attentionStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">{eng.compositeScore}</span>
                <div className="flex gap-2">
                  {eng.pillars.map((p) => (
                    <MiniSparkline key={p.pillarId} data={p.sparkline} trend={p.trend} width={50} height={18} />
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
