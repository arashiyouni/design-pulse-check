import type { TimelineEvent } from '@/../product/sections/engineer-scorecard/types'
import {
  MessageSquare,
  ClipboardCheck,
  UserCheck,
  AlertTriangle,
  ListChecks,
} from 'lucide-react'

const typeConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
}> = {
  survey: {
    icon: MessageSquare,
    iconBg: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300',
  },
  'check-in': {
    icon: UserCheck,
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
  },
  'self-assessment': {
    icon: ClipboardCheck,
    iconBg: 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300',
  },
  alert: {
    icon: AlertTriangle,
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
  'action-item': {
    icon: ListChecks,
    iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300',
  },
}

interface TimelineProps {
  events: TimelineEvent[]
  onEventClick?: (eventId: string) => void
}

export function Timeline({ events, onEventClick }: TimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-5 text-sm font-semibold text-slate-900 dark:text-white">Signal Timeline</h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-0">
          {events.map((event) => {
            const config = typeConfig[event.type] || typeConfig.survey
            const Icon = config.icon

            return (
              <button
                key={event.id}
                onClick={() => onEventClick?.(event.id)}
                className="group relative flex w-full gap-4 py-3 text-left transition-colors hover:bg-slate-50/50 rounded-lg px-1 dark:hover:bg-slate-800/30"
              >
                {/* Icon */}
                <div className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
                  <Icon className="size-3.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {event.title}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                      {event.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {event.description}
                  </p>
                  {event.pillar && (
                    <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {event.pillar}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
