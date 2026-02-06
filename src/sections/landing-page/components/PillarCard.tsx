import type { Pillar } from '@/../product/sections/landing-page/types'
import { Heart, Users, TrendingUp, GitPullRequest } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  users: Users,
  'trending-up': TrendingUp,
  'git-pull-request': GitPullRequest,
}

interface PillarCardProps {
  pillar: Pillar
  index: number
}

export function PillarCard({ pillar, index }: PillarCardProps) {
  const Icon = iconMap[pillar.icon] || Heart

  return (
    <div
      className="group relative rounded-2xl border border-slate-200/60 bg-white p-6 sm:p-8 transition-all duration-300 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:shadow-teal-500/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Pillar number */}
      <span className="absolute top-4 right-5 font-mono text-xs font-semibold text-slate-300 dark:text-slate-700">
        0{index + 1}
      </span>

      {/* Icon */}
      <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-400 dark:group-hover:bg-teal-950">
        <Icon className="size-5" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {pillar.title}
      </h3>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {pillar.description}
      </p>

      {/* Metrics */}
      <div className="flex flex-wrap gap-2">
        {pillar.metrics.map((metric) => (
          <span
            key={metric}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            {metric}
          </span>
        ))}
      </div>
    </div>
  )
}
