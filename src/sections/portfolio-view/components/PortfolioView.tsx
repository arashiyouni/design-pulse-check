import { useState, useMemo } from 'react'
import type { PortfolioViewProps, RosterEngineer } from '@/../product/sections/portfolio-view/types'
import { Search, CalendarDays, LayoutList, Table2, SlidersHorizontal, X } from 'lucide-react'
import { SummaryCards } from './SummaryCards'
import { RosterTable } from './RosterTable'
import { TrendGroups } from './TrendGroups'
import { WeightPanel } from './WeightPanel'

type ViewMode = 'table' | 'grouped'

export function PortfolioView({
  summaryStats,
  roster,
  pillarWeights,
  trendGroups,
  filterOptions,
  currentPeriod,
  previousPeriod,
  onEngineerClick,
  onFilterChange,
  onSearchChange,
  onWeightChange,
  onPeriodToggle,
  onSortChange,
}: PortfolioViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [showWeights, setShowWeights] = useState(false)
  const [sortColumn, setSortColumn] = useState('compositeScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedTrend, setSelectedTrend] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Filter and search
  const filteredRoster = useMemo(() => {
    let result = [...roster]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((eng) => eng.name.toLowerCase().includes(q))
    }
    if (selectedProject) {
      result = result.filter((eng) => eng.project === selectedProject)
    }
    if (selectedLevel) {
      result = result.filter((eng) => eng.level === selectedLevel)
    }
    if (selectedTrend) {
      result = result.filter((eng) => eng.overallTrend === selectedTrend)
    }
    if (selectedStatus) {
      result = result.filter((eng) => eng.attentionStatus === selectedStatus)
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0

      if (sortColumn === 'name') {
        aVal = a.name
        bVal = b.name
      } else if (sortColumn === 'project') {
        aVal = a.project
        bVal = b.project
      } else if (sortColumn === 'compositeScore') {
        aVal = a.compositeScore
        bVal = b.compositeScore
      } else if (sortColumn === 'overallTrend') {
        const order = { declining: 0, stable: 1, improving: 2 }
        aVal = order[a.overallTrend]
        bVal = order[b.overallTrend]
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return result
  }, [roster, searchQuery, selectedProject, selectedLevel, selectedTrend, selectedStatus, sortColumn, sortDirection])

  const hasActiveFilters = selectedProject || selectedLevel || selectedTrend || selectedStatus

  const handleSortChange = (col: string, dir: 'asc' | 'desc') => {
    setSortColumn(col)
    setSortDirection(dir)
    onSortChange?.(col, dir)
  }

  const clearFilters = () => {
    setSelectedProject('')
    setSelectedLevel('')
    setSelectedTrend('')
    setSelectedStatus('')
    setSearchQuery('')
  }

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 font-['Inter',sans-serif] sm:px-6 lg:px-8">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio View</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {summaryStats.totalEngineers} engineers &middot; {formatPeriod(currentPeriod)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPeriodToggle?.(previousPeriod)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <CalendarDays className="size-3.5 text-slate-400" />
            {formatPeriod(currentPeriod)}
          </button>
        </div>
      </div>

      {/* ── Summary Stats ─────────────────────────────────────── */}
      <div className="mb-6">
        <SummaryCards stats={summaryStats} />
      </div>

      {/* ── Toolbar: Search + Filters + View Toggle + Weights ── */}
      <div className="mb-4 space-y-3">
        {/* Row 1: Search + view toggles */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search engineers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                onSearchChange?.(e.target.value)
              }}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
            />
          </div>

          {/* View mode + weights toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 rounded-l-lg px-3 py-2 text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Table2 className="size-3.5" />
                Table
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                className={`flex items-center gap-1.5 rounded-r-lg px-3 py-2 text-xs font-medium transition-colors ${
                  viewMode === 'grouped'
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <LayoutList className="size-3.5" />
                Grouped
              </button>
            </div>

            <button
              onClick={() => setShowWeights(!showWeights)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                showWeights
                  ? 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              Weights
            </button>
          </div>
        </div>

        {/* Row 2: Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value)
              onFilterChange?.({ projects: e.target.value ? [e.target.value] : filterOptions.projects })
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Projects</option>
            {filterOptions.projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value)
              onFilterChange?.({ levels: e.target.value ? [e.target.value as typeof selectedLevel & string] : filterOptions.levels })
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 capitalize focus:border-teal-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Levels</option>
            {filterOptions.levels.map((l) => (
              <option key={l} value={l} className="capitalize">{l}</option>
            ))}
          </select>

          <select
            value={selectedTrend}
            onChange={(e) => {
              setSelectedTrend(e.target.value)
              onFilterChange?.({ trends: e.target.value ? [e.target.value as typeof selectedTrend & string] : filterOptions.trends })
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 capitalize focus:border-teal-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Trends</option>
            {filterOptions.trends.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              onFilterChange?.({ statuses: e.target.value ? [e.target.value as typeof selectedStatus & string] : filterOptions.statuses })
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 capitalize focus:border-teal-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="">All Statuses</option>
            {filterOptions.statuses.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
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

          {/* Result count */}
          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
            {filteredRoster.length} of {roster.length} engineers
          </span>
        </div>
      </div>

      {/* ── Weight Panel (conditional) ────────────────────────── */}
      {showWeights && (
        <div className="mb-6">
          <WeightPanel weights={pillarWeights} onWeightChange={onWeightChange} />
        </div>
      )}

      {/* ── Content: Table or Grouped ─────────────────────────── */}
      {viewMode === 'table' ? (
        <RosterTable
          engineers={filteredRoster}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onEngineerClick={onEngineerClick}
          onSortChange={handleSortChange}
        />
      ) : (
        <TrendGroups groups={trendGroups} onEngineerClick={onEngineerClick} />
      )}
    </div>
  )
}
