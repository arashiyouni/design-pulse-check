interface IntegrationBadgeProps {
  type: 'github' | 'jira' | 'linear'
  status: 'connected' | 'disconnected' | 'error'
}

const integrationMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  github: {
    label: 'GitHub',
    icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  jira: {
    label: 'Jira',
    icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005z" />
        <path d="M5.024 5.958H16.59a5.218 5.218 0 00-5.232-5.215H9.228V-1.314A5.215 5.215 0 004.019 4.958v.995a1.005 1.005 0 001.005 1.005z" opacity=".65" />
        <path d="M16.59 5.958a5.218 5.218 0 00-5.232 5.215v2.057a5.215 5.215 0 005.215 5.257V6.963a1.005 1.005 0 00-1.005-1.005H16.59z" opacity=".35" />
      </svg>
    ),
  },
  linear: {
    label: 'Linear',
    icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.088 15.32a11.998 11.998 0 006.592 6.592L2.088 15.32zM1.003 12.96a12.02 12.02 0 001.517 5.243l6.72 6.72A12.02 12.02 0 0014.48 26.44L1.003 12.96zM3.47 6.23A12 12 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0a12 12 0 00-8.53 3.53l14.06 14.06A7.5 7.5 0 1012 4.5a7.48 7.48 0 00-5.34 2.22L3.47 6.23z" />
      </svg>
    ),
  },
}

const statusStyles: Record<string, string> = {
  connected: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
  disconnected: 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-700',
  error: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
}

export function IntegrationBadge({ type, status }: IntegrationBadgeProps) {
  const meta = integrationMeta[type]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
      title={`${meta.label}: ${status}`}
    >
      {meta.icon}
      {meta.label}
      {status === 'error' && (
        <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
    </span>
  )
}
