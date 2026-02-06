import type { PersonaCard } from '@/../product/sections/landing-page/types'
import { User, Briefcase, Eye } from 'lucide-react'
import { CheckCircle2 } from 'lucide-react'

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  engineer: User,
  lead: Briefcase,
  partner: Eye,
}

const roleAccents: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  engineer: {
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-900',
    icon: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  },
  lead: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-900',
    icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  },
  partner: {
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    border: 'border-slate-300 dark:border-slate-700',
    icon: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    badge: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  },
}

interface PersonaSectionProps {
  personas: PersonaCard[]
}

export function PersonaSection({ personas }: PersonaSectionProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {personas.map((persona) => {
        const Icon = roleIcons[persona.role] || User
        const accent = roleAccents[persona.role] || roleAccents.engineer

        return (
          <div
            key={persona.id}
            className={`group relative overflow-hidden rounded-2xl border ${accent.border} ${accent.bg} p-6 sm:p-7 transition-all duration-300 hover:shadow-lg`}
          >
            {/* Role badge */}
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-lg ${accent.icon}`}>
                <Icon className="size-5" />
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}>
                {persona.title}
              </span>
            </div>

            {/* Description */}
            <p className="mb-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {persona.description}
            </p>

            {/* Capabilities */}
            <ul className="space-y-2.5">
              {persona.capabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-500 dark:text-teal-400" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
