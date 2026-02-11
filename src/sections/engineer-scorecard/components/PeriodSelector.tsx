import { useState, useRef, useEffect } from 'react'
import { CalendarDays, ChevronDown, Check } from 'lucide-react'

interface PeriodOption {
  id: string
  label: string
  value: string
  description?: string
}

interface PeriodSelectorProps {
  currentPeriod: string
  onPeriodChange?: (period: string) => void
}

// Helper function to get date ranges
const getDateRanges = () => {
  const now = new Date()
  
  // This Week
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - now.getDay()) // Sunday
  const thisWeekEnd = new Date(thisWeekStart)
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6)
  
  // Last Week
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(lastWeekStart)
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
  
  // This Month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  // Last Month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  const formatPeriodValue = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  
  return [
    {
      id: 'this-week',
      label: 'This Week',
      value: formatPeriodValue(thisWeekStart),
      description: `${formatDate(thisWeekStart)} - ${formatDate(thisWeekEnd)}`,
    },
    {
      id: 'last-week',
      label: 'Last Week',
      value: formatPeriodValue(lastWeekStart),
      description: `${formatDate(lastWeekStart)} - ${formatDate(lastWeekEnd)}`,
    },
    {
      id: 'this-month',
      label: 'This Month',
      value: formatPeriodValue(thisMonthStart),
      description: `${formatDate(thisMonthStart)} - ${formatDate(thisMonthEnd)}`,
    },
    {
      id: 'last-month',
      label: 'Last Month',
      value: formatPeriodValue(lastMonthStart),
      description: `${formatDate(lastMonthStart)} - ${formatDate(lastMonthEnd)}`,
    },
  ]
}

export function PeriodSelector({ currentPeriod, onPeriodChange }: PeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const periods = getDateRanges()
  const selectedPeriod = periods.find(p => p.value === currentPeriod) || periods[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (period: PeriodOption) => {
    onPeriodChange?.(period.value)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <CalendarDays className="size-4 text-slate-400" />
        <span>{selectedPeriod.label}</span>
        <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-2">
            <div className="mb-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Period
            </div>
            {periods.map((period) => {
              const isSelected = period.id === selectedPeriod.id
              
              return (
                <button
                  key={period.id}
                  onClick={() => handleSelect(period)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-medium ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                      {period.label}
                    </div>
                    {period.description && (
                      <div className={`text-xs ${isSelected ? 'text-teal-600/80 dark:text-teal-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {period.description}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="size-4 text-teal-600 dark:text-teal-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Custom Range Option */}
          <div className="border-t border-slate-200 p-2 dark:border-slate-700">
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
              onClick={() => {
                // You can implement custom date range picker here
                setIsOpen(false)
              }}
            >
              <CalendarDays className="size-4" />
              Custom Range...
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
