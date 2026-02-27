import { useState } from 'react'
import type {
  ActionItem,
  ActionStatus,
  ActionEffectiveness,
} from '@/../product/sections/needs-attention-and-actions/types'
import { Circle, Clock, CheckCircle2, Calendar, TrendingUp } from 'lucide-react'

const statusConfig: Record<
  ActionStatus,
  {
    icon: React.ComponentType<{ className?: string }>
    badge: string
    label: string
  }
> = {
  open: {
    icon: Circle,
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    label: 'Open',
  },
  'in-progress': {
    icon: Clock,
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    label: 'In Progress',
  },
  completed: {
    icon: CheckCircle2,
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    label: 'Completed',
  },
}

interface ActionItemsTableProps {
  actionItems: ActionItem[]
  effectivenessData?: ActionEffectiveness[]
  onUpdateStatus?: (id: string, status: ActionStatus) => void
  onComplete?: (id: string, note: string) => void
  onFilterByStatus?: (status: ActionStatus | 'all') => void
  onFilterByEngineer?: (engineerId: string | 'all') => void
  onViewEffectiveness?: (actionId: string) => void
}

export function ActionItemsTable({
  actionItems,
  effectivenessData = [],
  onUpdateStatus,
  onComplete,
  onFilterByStatus,
  onViewEffectiveness,
}: ActionItemsTableProps) {
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'all'>('all')
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [resolutionNote, setResolutionNote] = useState('')

  const filtered =
    statusFilter === 'all'
      ? actionItems
      : actionItems.filter((a) => a.status === statusFilter)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isOverdue = (dueDate: string, status: ActionStatus) => {
    if (status === 'completed') return false
    return new Date(dueDate) < new Date()
  }

  const hasEffectiveness = (id: string) =>
    effectivenessData.some((e) => e.actionId === id)

  const getVerdict = (id: string) =>
    effectivenessData.find((e) => e.actionId === id)?.verdict

  const handleComplete = (id: string) => {
    onComplete?.(id, resolutionNote)
    setCompletingId(null)
    setResolutionNote('')
  }

  return (
    <div>
      {/* Status filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {(['all', 'open', 'in-progress', 'completed'] as const).map((s) => {
          const count =
            s === 'all'
              ? actionItems.length
              : actionItems.filter((a) => a.status === s).length
          return (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s)
                onFilterByStatus?.(s)
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')} ({count})
            </button>
          )
        })}
      </div>

      {/* Action items */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
            <CheckCircle2 className="mx-auto mb-2 size-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No action items in this category
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const config = statusConfig[item.status]
            const StatusIcon = config.icon
            const overdue = isOverdue(item.dueDate, item.status)
            const evaluated = hasEffectiveness(item.id)
            const verdict = getVerdict(item.id)

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start gap-3">
                  <StatusIcon
                    className={`mt-0.5 size-5 shrink-0 ${
                      item.status === 'completed'
                        ? 'text-teal-500 dark:text-teal-400'
                        : item.status === 'in-progress'
                        ? 'text-amber-500 dark:text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.engineerName}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}
                        >
                          {config.label}
                        </span>
                        {item.pillar && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {item.pillar}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                      <span
                        className={`flex items-center gap-1 ${
                          overdue ? 'font-semibold text-red-500 dark:text-red-400' : ''
                        }`}
                      >
                        <Calendar className="size-3" />
                        {overdue ? 'Overdue: ' : 'Due: '}
                        {formatDate(item.dueDate)}
                      </span>
                      <span>by {item.createdBy}</span>
                    </div>

                    {/* Resolution note for completed items */}
                    {item.resolutionNote && (
                      <div className="mt-2 rounded-lg bg-teal-50/50 px-3 py-2 text-xs text-teal-700 dark:bg-teal-950/30 dark:text-teal-300">
                        {item.resolutionNote}
                      </div>
                    )}

                    {/* Complete form */}
                    {completingId === item.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          placeholder="Resolution note..."
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleComplete(item.id)}
                            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => {
                              setCompletingId(null)
                              setResolutionNote('')
                            }}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {item.status !== 'completed' && completingId !== item.id && (
                        <>
                          {item.status === 'open' && (
                            <button
                              onClick={() => onUpdateStatus?.(item.id, 'in-progress')}
                              className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                            >
                              Start Progress
                            </button>
                          )}
                          <button
                            onClick={() => setCompletingId(item.id)}
                            className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            Complete
                          </button>
                        </>
                      )}

                      {/* View Effectiveness — only on completed items with evaluation data */}
                      {item.status === 'completed' && evaluated && verdict && (
                        <button
                          onClick={() => onViewEffectiveness?.(item.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/70"
                        >
                          <TrendingUp className="size-3" />
                          View Effectiveness
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold capitalize ${
                              verdict === 'resolved'
                                ? 'bg-teal-200 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                                : verdict === 'monitoring'
                                ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {verdict}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
