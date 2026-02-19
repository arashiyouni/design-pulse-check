import { useState, useMemo } from 'react'
import type { ProjectSettingsProps } from '@/../product/sections/project-settings/types'
import { Search, Plus, X, ChevronUp, ChevronDown, FolderKanban } from 'lucide-react'
import { ProjectRow, ProjectCard } from './ProjectRow'
import { CreateProjectWizard } from './CreateProjectWizard'

type SortColumn = 'name' | 'organization' | 'engineers' | 'lastActivity'

function SortHeader({
  label,
  column,
  currentSort,
  currentDirection,
  onSort,
  className = '',
}: {
  label: string
  column: SortColumn
  currentSort: SortColumn
  currentDirection: 'asc' | 'desc'
  onSort: (col: SortColumn, dir: 'asc' | 'desc') => void
  className?: string
}) {
  const active = currentSort === column
  return (
    <button
      onClick={() => onSort(column, active && currentDirection === 'asc' ? 'desc' : 'asc')}
      className={`group flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 ${className}`}
    >
      {label}
      <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
        {active && currentDirection === 'desc' ? (
          <ChevronDown className="size-3" />
        ) : (
          <ChevronUp className="size-3" />
        )}
      </span>
    </button>
  )
}

export function ProjectList({
  organizations,
  projects,
  onCreateProject,
  onEditProject,
  onToggleProjectStatus,
  onSelectProject,
}: ProjectSettingsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortColumn, setSortColumn] = useState<SortColumn>('lastActivity')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showWizard, setShowWizard] = useState(false)

  const orgOptions = useMemo(() => {
    const orgs = new Set(projects.map((p) => p.organizationName).filter(Boolean))
    return ['Internal', ...Array.from(orgs)] as string[]
  }, [projects])

  const filteredProjects = useMemo(() => {
    let result = [...projects]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.organizationName?.toLowerCase().includes(q) ?? false) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (selectedOrg) {
      if (selectedOrg === 'Internal') {
        result = result.filter((p) => p.type === 'internal')
      } else {
        result = result.filter((p) => p.organizationName === selectedOrg)
      }
    }

    if (selectedStatus) {
      result = result.filter((p) => p.status === selectedStatus)
    }

    result.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortColumn) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'organization':
          aVal = (a.organizationName ?? 'zzz').toLowerCase()
          bVal = (b.organizationName ?? 'zzz').toLowerCase()
          break
        case 'engineers':
          aVal = a.engineerCount
          bVal = b.engineerCount
          break
        case 'lastActivity':
          aVal = new Date(a.lastActivityAt).getTime()
          bVal = new Date(b.lastActivityAt).getTime()
          break
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return result
  }, [projects, searchQuery, selectedOrg, selectedStatus, sortColumn, sortDirection])

  const hasActiveFilters = selectedOrg || selectedStatus
  const activeCount = projects.filter((p) => p.status === 'active').length
  const totalIntegrations = projects.reduce((acc, p) => acc + p.integrations.filter((i) => i.status === 'connected').length, 0)

  const handleSort = (col: SortColumn, dir: 'asc' | 'desc') => {
    setSortColumn(col)
    setSortDirection(dir)
  }

  const clearFilters = () => {
    setSelectedOrg('')
    setSelectedStatus('')
    setSearchQuery('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeCount} active &middot; {organizations.length} organizations &middot; {totalIntegrations} connected integrations
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-teal-600 hover:to-teal-700 hover:shadow-lg active:scale-[0.98] dark:from-teal-500 dark:to-teal-600 dark:hover:from-teal-400 dark:hover:to-teal-500"
        >
          <Plus className="size-4" />
          New Project
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Projects</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">{projects.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Engineers</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {projects.reduce((acc, p) => acc + p.engineerCount, 0)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Integrations</div>
          <div className="mt-1 text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono">{totalIntegrations}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Organizations</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">{organizations.length}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Organizations</option>
            {orgOptions.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 capitalize focus:border-teal-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <X className="size-3" />
              Clear
            </button>
          )}

          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
            {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
      </div>

      {/* Desktop table */}
      {filteredProjects.length > 0 ? (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3 text-left">
                    <SortHeader label="Project" column="name" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <SortHeader label="Organization" column="organization" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <SortHeader label="Engineers" column="engineers" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Integrations</span>
                  </th>
                  <th className="px-3 py-3 text-right">
                    <SortHeader label="Activity" column="lastActivity" currentSort={sortColumn} currentDirection={sortDirection} onSort={handleSort} className="justify-end" />
                  </th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onSelect={() => onSelectProject?.(project.id)}
                    onEdit={() => onEditProject?.(project.id, {})}
                    onArchive={() => onToggleProjectStatus?.(project.id, project.status === 'active' ? 'archived' : 'active')}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 lg:hidden">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => onSelectProject?.(project.id)}
                onEdit={() => onEditProject?.(project.id, {})}
                onArchive={() => onToggleProjectStatus?.(project.id, project.status === 'active' ? 'archived' : 'active')}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <FolderKanban className="size-7 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">No projects found</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            {searchQuery || hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Create your first project to get started.'}
          </p>
          {!searchQuery && !hasActiveFilters && (
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              <Plus className="size-4" />
              New Project
            </button>
          )}
        </div>
      )}

      {/* Create Project Wizard */}
      <CreateProjectWizard
        organizations={organizations}
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onCreate={onCreateProject}
      />
    </div>
  )
}
