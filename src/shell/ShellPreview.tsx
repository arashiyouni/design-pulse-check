import AppShell from './components/AppShell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const navigationItems = [
  { label: 'Dashboard', href: '/', isActive: true },
  { label: 'Engineer Scorecard', href: '/scorecard' },
  { label: 'Data & Signals', href: '/signals' },
  { label: 'Needs Attention', href: '/attention' },
  { label: 'Portfolio View', href: '/portfolio' },
  { label: 'Settings', href: '/settings' },
]

const user = {
  name: 'Alex Morgan',
  role: 'Partner',
}

export default function ShellPreview() {
  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      currentPeriod="Feb 2026"
      notificationCount={3}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
      onPeriodChange={(period) => console.log('Change period:', period)}
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of engineering health across all placements.
          </p>
        </div>

        {/* Sample stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Engineers', value: '194', trend: '+3', status: 'neutral' },
            { label: 'Healthy', value: '167', trend: '+5', status: 'success' },
            { label: 'Monitor', value: '18', trend: '-2', status: 'warning' },
            { label: 'Needs Attention', value: '9', trend: '+1', status: 'danger' },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="p-4 border-slate-200 dark:border-slate-800"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold font-['JetBrains_Mono',monospace] text-slate-900 dark:text-slate-100">
                  {stat.value}
                </span>
                <Badge
                  variant="secondary"
                  className={
                    stat.status === 'success'
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : stat.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : stat.status === 'danger'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }
                >
                  {stat.trend}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Placeholder content area */}
        <Card className="p-8 border-slate-200 dark:border-slate-800 border-dashed">
          <div className="text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm">Section content renders here.</p>
            <p className="mt-1 text-xs">
              Hover the left edge or click the menu button to open the sidebar.
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
