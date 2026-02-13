import { useState } from 'react'
import type {
  EngineerOption,
  LeadCheckInForm as LeadCheckInFormData,
  LeadStatus,
  DimensionKey,
  DimensionRatings,
  LastSelfAssessment,
} from '@/../product/sections/data-ingestion-and-signals/types'
import { UserCheck, ChevronDown, Link2, BarChart3, Sparkles, ExternalLink, Calendar, Target, TrendingUp, Check } from 'lucide-react'

/* ── Dimension definitions ───────────────────────────── */

const DIMENSIONS: { key: DimensionKey; label: string; description: string }[] = [
  { key: 'communication', label: 'Communication', description: 'Clarity, proactively informing, & technical writing.' },
  { key: 'ownership', label: 'Ownership', description: 'Follow-through on features & accountability.' },
  { key: 'reliability', label: 'Reliability', description: 'Bug-free code, PR standards, & performance.' },
  { key: 'teamwork', label: 'Teamwork', description: 'Collaboration, mentorship, & unblocking others.' },
  { key: 'initiative', label: 'Initiative', description: 'Proactive improvements & going beyond requirements.' },
]

const statusOptions: { value: LeadStatus; label: string; description: string; color: string }[] = [
  {
    value: 'growing',
    label: 'Growing',
    description: 'Actively developing new skills',
    color: 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950/30 dark:text-teal-300',
  },
  {
    value: 'stable',
    label: 'Stable',
    description: 'Consistent at current level',
    color: 'border-slate-400 bg-slate-50 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    value: 'blocked',
    label: 'Blocked',
    description: 'Facing obstacles, needs support',
    color: 'border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-300',
  },
]

/* ── Helpers ──────────────────────────────────────────── */

function trajectoryLabel(value: number) {
  if (value >= 4) return { text: 'Strong', color: 'text-emerald-600 dark:text-emerald-400' }
  if (value >= 3) return { text: 'Steady', color: 'text-amber-600 dark:text-amber-400' }
  return { text: 'Needs support', color: 'text-red-500 dark:text-red-400' }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Core Dimensions Selector ────────────────────────── */

function CoreDimensions({
  ratings,
  onRate,
}: {
  ratings: DimensionRatings
  onRate: (key: DimensionKey, value: number) => void
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-teal-600 dark:text-teal-400" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Core Dimensions</h4>
        </div>
        <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 dark:border-slate-700 dark:text-slate-500">
          KEYS 1–5 FOR INSTANT SELECTION
        </span>
      </div>

      <div className="space-y-2.5">
        {DIMENSIONS.map(({ key, label, description }) => {
          const selected = ratings[key]

          return (
            <div
              key={key}
              className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40"
            >
              {/* Label + description */}
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
              </div>

              {/* Rating chips */}
              <div className="flex shrink-0 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => onRate(key, n)}
                    className={`flex h-10 w-14 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      selected === n
                        ? 'bg-teal-600 text-white shadow-md dark:bg-teal-500'
                        : 'bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:bg-slate-700 dark:text-slate-500 dark:hover:bg-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Self-Assessment Panel ───────────────────────────── */

function SelfAssessmentPanel({ data }: { data: LastSelfAssessment }) {
  const trajectory = trajectoryLabel(data.growthTrajectory)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-4 text-violet-500 dark:text-violet-400" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Last Self-Assessment</h4>
      </div>

      <div className="space-y-4">
        {/* Period */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="size-3" />
          <span>Period: {data.period}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{formatDate(data.submittedAt)}</span>
        </div>

        {/* Skills */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Skills demonstrated</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsDemonstrated.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Level + Growth */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Level</p>
            <p className="mt-0.5 text-sm font-semibold capitalize text-slate-900 dark:text-white">{data.currentLevel}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Growth</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <TrendingUp className={`size-3.5 ${trajectory.color}`} />
              <span className={`text-sm font-semibold ${trajectory.color}`}>{data.growthTrajectory}/5</span>
              <span className={`text-xs ${trajectory.color}`}>{trajectory.text}</span>
            </div>
          </div>
        </div>

        {/* Target */}
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-slate-200 px-3 py-2 dark:border-slate-700">
          <Target className="mt-0.5 size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Next target</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{data.targetSkill}</p>
          </div>
        </div>

        {/* Evidence */}
        {data.evidenceUrls.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Evidence</p>
            <div className="space-y-1">
              {data.evidenceUrls.map((url) => {
                const short = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    <ExternalLink className="size-3 shrink-0" />
                    <span className="truncate">{short}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Form ───────────────────────────────────────── */

interface LeadCheckInFormProps {
  engineers: EngineerOption[]
  onSubmit?: (data: LeadCheckInFormData) => void
}

export function LeadCheckInForm({ engineers, onSubmit }: LeadCheckInFormProps) {
  const [selectedEngineer, setSelectedEngineer] = useState('')
  const [dimensionRatings, setDimensionRatings] = useState<DimensionRatings>({
    communication: null,
    ownership: null,
    reliability: null,
    teamwork: null,
    initiative: null,
  })
  const [status, setStatus] = useState<LeadStatus | ''>('')
  const [notes, setNotes] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [toast, setToast] = useState<{ name: string; status: string } | null>(null)

  const selectedEng = engineers.find((e) => e.id === selectedEngineer)
  const ratedCount = Object.values(dimensionRatings).filter((v) => v !== null).length
  const isValid = selectedEngineer && status && ratedCount === 5

  const handleRate = (key: DimensionKey, value: number) => {
    setDimensionRatings((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const handleSubmit = () => {
    if (!isValid || !status) return
    onSubmit?.({
      engineerId: selectedEngineer,
      engineerName: selectedEng?.name || '',
      dimensionRatings,
      status,
      notes,
      evidenceUrl: evidenceUrl || null,
    })
    setToast({ name: selectedEng?.name || '', status })
    setSelectedEngineer('')
    setDimensionRatings({ communication: null, ownership: null, reliability: null, teamwork: null, initiative: null })
    setStatus('')
    setNotes('')
    setEvidenceUrl('')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Success toast */}
      {toast && (
        <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 dark:bg-emerald-400">
            <Check className="size-3.5 text-white dark:text-emerald-950" />
          </div>
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            Check-in for <span className="font-semibold">{toast.name}</span> submitted
            <span className="ml-1 text-emerald-600 dark:text-emerald-400">· {toast.status}</span>
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr,300px]">
        {/* ── Left: Check-In Form (single card) ──────────── */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-2">
            <UserCheck className="size-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Lead Check-In</h3>
            {ratedCount > 0 && (
              <span className="ml-auto rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                {ratedCount}/5 rated
              </span>
            )}
          </div>

          <div className="space-y-6">
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

            {/* Core Dimensions */}
            <CoreDimensions
              ratings={dimensionRatings}
              onRate={handleRate}
            />

            {/* Status tag */}
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

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Notes <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
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

        {/* ── Right: Self-Assessment Context ─────────────── */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedEng?.lastSelfAssessment ? (
            <SelfAssessmentPanel data={selectedEng.lastSelfAssessment} />
          ) : selectedEngineer ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/30">
              <Sparkles className="mx-auto mb-2 size-5 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-400 dark:text-slate-500">No self-assessment submitted yet</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/30">
              <Sparkles className="mx-auto mb-2 size-5 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-400 dark:text-slate-500">Select an engineer to see their last self-assessment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
