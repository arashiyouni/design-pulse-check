import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  UserCircle,
  Database,
  AlertTriangle,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
  isActive?: boolean
}

interface MainNavProps {
  navigationItems: NavItem[]
  onNavigate?: (href: string) => void
}

const defaultIcons: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  'Engineer Scorecard': UserCircle,
  'Data & Signals': Database,
  'Needs Attention': AlertTriangle,
  'Portfolio View': Users,
  Settings: Settings,
}

export function MainNav({ navigationItems, onNavigate }: MainNavProps) {
  const mainItems = navigationItems.filter((item) => item.label !== 'Settings')
  const settingsItem = navigationItems.find((item) => item.label === 'Settings')

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 px-3 py-2 space-y-1">
        {mainItems.map((item) => {
          const Icon = item.icon || defaultIcons[item.label] || LayoutDashboard
          return (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={cn(
                'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                item.isActive
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>

      {settingsItem && (
        <>
          <Separator className="mx-3" />
          <div className="px-3 py-2">
            <button
              onClick={() => onNavigate?.(settingsItem.href)}
              className={cn(
                'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                settingsItem.isActive
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              )}
            >
              <Settings className="size-4 shrink-0" />
              <span className="truncate">{settingsItem.label}</span>
            </button>
          </div>
        </>
      )}
    </nav>
  )
}
