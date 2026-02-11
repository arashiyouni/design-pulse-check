import { BarChart3, Target, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface SidebarNavProps {
  activeSection: string
  onNavigate: (section: string) => void
  completionStatus: {
    delivery: boolean
    clientSatisfaction: boolean
    teamFeedback: boolean
    growth: boolean
    assessment: boolean
    timeline: boolean
  }
}

const sections = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'pillars', label: 'Pillars', icon: Target },
  { id: 'timeline', label: 'Timeline', icon: Clock },
]

export function SidebarNav({ activeSection, onNavigate, completionStatus }: SidebarNavProps) {
  const getStatusIcon = (sectionId: string) => {
    if (sectionId === 'overview') return null
    if (sectionId === 'pillars') {
      const allComplete = completionStatus.delivery && completionStatus.clientSatisfaction && 
                         completionStatus.teamFeedback && completionStatus.growth
      return allComplete ? (
        <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
      ) : null
    }
    if (sectionId === 'timeline') {
      return completionStatus.timeline ? (
        <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
      ) : null
    }
    return null
  }

  return (
    <nav className="sticky top-6 space-y-1">
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Navigation
      </div>
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = activeSection === section.id
        const statusIcon = getStatusIcon(section.id)

        return (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              isActive
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className="size-4" />
              <span>{section.label}</span>
            </div>
            {statusIcon}
          </button>
        )
      })}

      {/* Progress Summary */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Progress
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Delivery</span>
            {completionStatus.delivery && (
              <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Client Satisfaction</span>
            {completionStatus.clientSatisfaction && (
              <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Team Feedback</span>
            {completionStatus.teamFeedback && (
              <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Growth</span>
            {completionStatus.growth && (
              <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
          <div className="border-t border-slate-200 pt-2 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Assessment</span>
              {completionStatus.assessment ? (
                <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
              ) : (
                <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
