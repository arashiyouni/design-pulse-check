import type { Project } from '@/../product/sections/project-settings/types'
import { IntegrationBadge } from './IntegrationBadge'
import { MoreHorizontal, Users, Building2, Zap, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ProjectRowProps {
  project: Project
  onSelect?: () => void
  onEdit?: () => void
  onArchive?: () => void
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ProjectRow({ project, onSelect, onEdit, onArchive }: ProjectRowProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const connectedIntegrations = project.integrations.filter(i => i.status === 'connected').length
  const errorIntegrations = project.integrations.filter(i => i.status === 'error').length

  return (
    <>
      {/* Desktop row */}
      <tr
        onClick={onSelect}
        className="group cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/80 last:border-0 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
      >
        {/* Project name + description */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500/10 to-teal-600/10 dark:from-teal-400/10 dark:to-teal-500/10">
              {project.type === 'internal' ? (
                <Zap className="size-4 text-teal-600 dark:text-teal-400" />
              ) : (
                <Building2 className="size-4 text-teal-600 dark:text-teal-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {project.name}
                </span>
                {project.type === 'internal' && (
                  <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    Internal
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {project.description}
              </p>
            </div>
          </div>
        </td>

        {/* Organization */}
        <td className="px-3 py-3.5">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {project.organizationName ?? <span className="italic text-slate-400 dark:text-slate-500">Ravn</span>}
          </span>
        </td>

        {/* Engineers */}
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {project.engineers.slice(0, 3).map((eng) => (
                <div
                  key={eng.engineerId}
                  className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] font-bold text-slate-500 dark:border-slate-900 dark:bg-slate-700 dark:text-slate-300"
                  title={`${eng.engineerName} (${eng.role})`}
                >
                  {eng.engineerName.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
              {project.engineers.length > 3 && (
                <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-500 dark:border-slate-900 dark:bg-slate-700 dark:text-slate-400">
                  +{project.engineers.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {project.engineerCount}
            </span>
          </div>
        </td>

        {/* Integrations */}
        <td className="px-3 py-3.5">
          {project.integrations.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.integrations.map((integration) => (
                <IntegrationBadge
                  key={integration.id}
                  type={integration.type}
                  status={integration.status}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">
              None
            </span>
          )}
        </td>

        {/* Last Activity */}
        <td className="px-3 py-3.5 text-right">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
            {formatRelativeTime(project.lastActivityAt)}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <MoreHorizontal className="size-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.()
                      setShowMenu(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Edit details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onArchive?.()
                      setShowMenu(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    Archive project
                  </button>
                </div>
              )}
            </div>
            <ChevronRight className="size-4 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
          </div>
        </td>
      </tr>
    </>
  )
}

export function ProjectCard({ project, onSelect, onEdit, onArchive }: ProjectRowProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  return (
    <button
      onClick={onSelect}
      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500/10 to-teal-600/10 dark:from-teal-400/10 dark:to-teal-500/10">
            {project.type === 'internal' ? (
              <Zap className="size-3.5 text-teal-600 dark:text-teal-400" />
            ) : (
              <Building2 className="size-3.5 text-teal-600 dark:text-teal-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{project.name}</span>
              {project.type === 'internal' && (
                <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  Internal
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {project.organizationName ?? 'Ravn'}
            </span>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Edit details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive?.()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Archive project
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Users className="size-3.5" />
          {project.engineerCount} engineers
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {formatRelativeTime(project.lastActivityAt)}
        </span>
      </div>

      {project.integrations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.integrations.map((integration) => (
            <IntegrationBadge
              key={integration.id}
              type={integration.type}
              status={integration.status}
            />
          ))}
        </div>
      )}
    </button>
  )
}
