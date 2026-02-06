import { useState, useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Menu, Bell, ChevronDown, PanelLeftClose, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MainNav, type NavItem } from './MainNav'
import { UserMenu } from './UserMenu'

interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavItem[]
  user?: { name: string; avatarUrl?: string; role?: string }
  currentPeriod?: string
  notificationCount?: number
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onPeriodChange?: (period: string) => void
}

export default function AppShell({
  children,
  navigationItems,
  user = { name: 'Alex Morgan', role: 'Partner' },
  currentPeriod = 'Feb 2026',
  notificationCount = 0,
  onNavigate,
  onLogout,
  onPeriodChange,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarPeek, setSidebarPeek] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(false)
  const peekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Hover zone on the left edge to trigger peek
  const handleEdgeEnter = useCallback(() => {
    if (sidebarPinned) return
    peekTimeoutRef.current = setTimeout(() => {
      setSidebarPeek(true)
    }, 150)
  }, [sidebarPinned])

  const handleEdgeLeave = useCallback(() => {
    if (peekTimeoutRef.current) {
      clearTimeout(peekTimeoutRef.current)
    }
  }, [])

  const handleSidebarLeave = useCallback(() => {
    if (!sidebarPinned) {
      setSidebarPeek(false)
    }
  }, [sidebarPinned])

  const togglePin = useCallback(() => {
    setSidebarPinned((prev) => !prev)
    setSidebarPeek(false)
  }, [])

  // Close peek when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        sidebarPeek &&
        !sidebarPinned &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarPeek(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [sidebarPeek, sidebarPinned])

  const sidebarVisible = sidebarPeek || sidebarPinned

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['Inter',sans-serif]">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex h-full items-center justify-between px-4">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={togglePin}
              className="hidden lg:flex"
              aria-label={sidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              <Menu className="size-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500 dark:bg-teal-600">
                <Activity className="size-4 text-white" />
              </div>
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Pulse Check
              </span>
            </div>
          </div>

          {/* Center: period selector */}
          <button
            onClick={() => onPeriodChange?.(currentPeriod)}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {currentPeriod}
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {/* Right: notifications + user */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 size-4 p-0 text-[10px] bg-amber-500 border-white dark:border-slate-900">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>
      </header>

      {/* ── Desktop: Hover edge zone (invisible) ────────────── */}
      <div
        className="fixed left-0 top-14 bottom-0 z-30 w-2 hidden lg:block"
        onMouseEnter={handleEdgeEnter}
        onMouseLeave={handleEdgeLeave}
      />

      {/* ── Desktop: Notion-style peek sidebar ─────────────── */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed left-0 top-14 bottom-0 z-30 w-64 hidden lg:flex flex-col transition-transform duration-200 ease-out',
          'bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-lg',
          'dark:bg-slate-900/95 dark:border-slate-800',
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        )}
        onMouseLeave={handleSidebarLeave}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={togglePin}
            className="size-6"
            aria-label={sidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            <PanelLeftClose
              className={cn(
                'size-3.5 transition-transform',
                sidebarPinned && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <MainNav
          navigationItems={navigationItems}
          onNavigate={(href) => {
            onNavigate?.(href)
            if (!sidebarPinned) setSidebarPeek(false)
          }}
        />
      </div>

      {/* ── Mobile: Sheet sidebar ──────────────────────────── */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500 dark:bg-teal-600">
                <Activity className="size-4 text-white" />
              </div>
              <span className="font-semibold">Pulse Check</span>
            </SheetTitle>
          </SheetHeader>
          <div className="py-2">
            <MainNav
              navigationItems={navigationItems}
              onNavigate={(href) => {
                onNavigate?.(href)
                setSidebarOpen(false)
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Content Area ───────────────────────────────────── */}
      <main
        className={cn(
          'pt-14 min-h-screen transition-[padding] duration-200',
          sidebarPinned ? 'lg:pl-64' : 'lg:pl-0'
        )}
      >
        {children}
      </main>
    </div>
  )
}
