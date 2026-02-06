import { useState } from 'react'
import type { EngineerOption, LeadCheckInForm as LeadCheckInFormData, LeadStatus } from '@/../product/sections/data-ingestion-and-signals/types'
import { UserCheck, ChevronDown, Link2 } from 'lucide-react'

const statusOptions: { value: LeadStatus; label: string; description: string; color: string }[] = [
  {
    value: 'growing',
    label: 'Growing',
    description: 'Actively developing new skills and taking on challenges',
    color: 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950/30 dark:text-teal-300',
  },
  {
    value: 'stable',
    label: 'Stable',
    description: 'Consistent performance at current level',
    color: 'border-slate-400 bg-slate-50 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    value: 'blocked',
    label: 'Blocked',
    description: 'Facing challenges that are limiting growth or performance',
    color: 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-300',
  },
]

interface LeadCheckInFormProps {
  engineers: EngineerOption[]
  onSubmit?: (data: LeadCheckInFormData) => void
}

export function LeadCheckInForm({ engineers, onSubmit }: LeadCheckInFormProps) {
  const [selectedEngineer, setSelectedEngineer] = useState('')
  const [status, setStatus] = useState<LeadStatus | ''>('')
  const [score, setScore] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const selectedEng = engineers.find((e) => e.id === selectedEngineer)
  const isValid = selectedEngineer && status && notes.trim()

  const handleSubmit = () => {
    if (!isValid || !status) return
    onSubmit?.({
      engineerId: selectedEngineer,
      engineerName: selectedEng?.name || '',
      status,
      score,
      notes,
      evidenceUrl: evidenceUrl || null,
    })
    // Reset form
    setSelectedEngineer('')
    setStatus('')
    setScore(null)
    setNotes('')
    setEvidenceUrl('')
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-2">
          <UserCheck className="size-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Lead Check-In</h3>
        </div>

        <div className="space-y-5">
          {/* Engineer selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Engineer</label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
              >
                {selectedEng ? (
                  <div>
                    <span className="text-slate-900 dark:text-white">{selectedEng.name}</span>
                    <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">{selectedEng.project}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">Select an engineer...</span>
                )}
                <ChevronDown className={`size-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {engineers.map((eng) => (
                    <button
                      key={eng.id}
                      onClick={() => { setSelectedEngineer(eng.id); setIsDropdownOpen(false) }}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <span className="text-slate-900 dark:text-white">{eng.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{eng.project} · {eng.level}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status radio buttons */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`rounded-lg border-2 px-3 py-2.5 text-left transition-colors ${
                    status === opt.value
                      ? opt.color
                      : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="mt-0.5 block text-[10px] leading-tight opacity-70">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Score slider */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Score <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={score ?? 3}
                onChange={(e) => setScore(Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-600 dark:bg-slate-700 dark:accent-teal-400"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setScore(score === n ? null : n)}
                    className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      score === n
                        ? 'bg-teal-600 text-white dark:bg-teal-500'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, context, and key evidence..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
            />
          </div>

          {/* Evidence URL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Evidence URL <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            Submit Check-In
          </button>
        </div>
      </div>
    </div>
  )
}
