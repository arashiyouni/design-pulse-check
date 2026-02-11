import { useState } from 'react'
import type {
  SelfAssessmentFormData,
  SelfAssessmentFormProps,
  EngineerLevel,
  GrowthTrajectoryRating,
  SkillOption,
} from '@/../product/sections/engineer-scorecard/types'
import {
  SKILL_OPTIONS,
  LEVEL_DEFINITIONS,
  TRAJECTORY_LABELS,
} from '@/../product/sections/engineer-scorecard/types'
import { ClipboardCheck, Pencil, ExternalLink, Check, Link, GraduationCap, TrendingUp } from 'lucide-react'

const EMPTY_FORM: SelfAssessmentFormData = {
  period: '',
  status: 'draft',
  skillsDemonstrated: [],
  evidenceUrl: '',
  currentLevel: 'junior',
  justification: '',
  growthTrajectory: 3,
  targetSkill: '',
  targetPlan: '',
}

export function SelfAssessmentForm({ data, period, onSubmit }: SelfAssessmentFormProps) {
  const isSubmitted = data?.status === 'submitted'
  const [editing, setEditing] = useState(!isSubmitted)
  const [form, setForm] = useState<SelfAssessmentFormData>(
    data ?? { ...EMPTY_FORM, period }
  )

  const toggleSkill = (skill: SkillOption) => {
    setForm((prev) => {
      const has = prev.skillsDemonstrated.includes(skill)
      if (has) {
        return { ...prev, skillsDemonstrated: prev.skillsDemonstrated.filter((s) => s !== skill) }
      }
      if (prev.skillsDemonstrated.length >= 3) return prev
      return { ...prev, skillsDemonstrated: [...prev.skillsDemonstrated, skill] }
    })
  }

  const handleSubmit = () => {
    const submitted: SelfAssessmentFormData = { ...form, period, status: 'submitted' }
    setForm(submitted)
    setEditing(false)
    onSubmit?.(submitted)
  }

  const canSubmit =
    form.skillsDemonstrated.length > 0 &&
    form.evidenceUrl.trim() !== '' &&
    form.justification.trim() !== '' &&
    form.targetSkill.trim() !== '' &&
    form.targetPlan.trim() !== ''

  // ── Read-only summary ───────────────────────────────────────
  if (!editing && isSubmitted) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/40">
              <ClipboardCheck className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Self-Assessment</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Pillar 3: Growth</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              <Check className="size-3" />
              Submitted
            </span>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Pencil className="size-3" />
              Edit
            </button>
          </div>
        </div>

        {/* Summary content */}
        <div className="space-y-4 p-5">
          {/* Q1 Summary */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <GraduationCap className="size-3" />
              Skills Demonstrated
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.skillsDemonstrated.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            {form.evidenceUrl && (
              <a
                href={form.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                <ExternalLink className="size-3" />
                Evidence
              </a>
            )}
          </div>

          {/* Q2 Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
              <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Current Level</div>
              <span className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                {form.currentLevel}
              </span>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {LEVEL_DEFINITIONS[form.currentLevel]}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
              <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Growth Trajectory</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                  {form.growthTrajectory}/5
                </span>
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  {TRAJECTORY_LABELS[form.growthTrajectory]}
                </span>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-1 text-xs font-medium text-slate-400 dark:text-slate-500">Justification</div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {form.justification}
            </p>
          </div>

          {/* Q3 Summary */}
          <div className="rounded-lg border border-teal-200 bg-teal-50/50 px-4 py-3 dark:border-teal-800 dark:bg-teal-950/30">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3 text-teal-600 dark:text-teal-400" />
              <div className="text-xs font-medium text-teal-600 dark:text-teal-400">Next Target</div>
            </div>
            <span className="text-sm font-medium text-teal-800 dark:text-teal-200">{form.targetSkill}</span>
            <p className="mt-1 text-xs leading-relaxed text-teal-700/80 dark:text-teal-300/70">
              {form.targetPlan}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Editable form ───────────────────────────────────────────
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/40">
            <ClipboardCheck className="size-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Self-Assessment</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">Pillar 3: Growth &middot; {period}</span>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          Draft
        </span>
      </div>

      <div className="space-y-6 p-5">
        {/* ── Q1: Skills Demonstrated ──────────────────────────── */}
        <fieldset>
          <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            <span className="flex size-5 items-center justify-center rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Q1
            </span>
            Skills Demonstrated
          </legend>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Which new skills have you applied this period? <span className="text-slate-400 dark:text-slate-500">(up to 3)</span>
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => {
              const selected = form.skillsDemonstrated.includes(skill as SkillOption)
              const disabled = !selected && form.skillsDemonstrated.length >= 3
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill as SkillOption)}
                  disabled={disabled}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    selected
                      ? 'border-teal-300 bg-teal-50 text-teal-700 shadow-sm dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                      : disabled
                        ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-teal-800 dark:hover:bg-teal-950/30 dark:hover:text-teal-300'
                  }`}
                >
                  {selected && <Check className="-ml-0.5 mr-1 inline size-3" />}
                  {skill}
                </button>
              )
            })}
          </div>

          {/* Evidence URL */}
          <div className="relative">
            <Link className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="url"
              placeholder="Evidence URL (PR, design doc, etc.)"
              value={form.evidenceUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, evidenceUrl: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
            />
          </div>
        </fieldset>

        {/* Divider */}
        <div className="border-t border-dashed border-slate-100 dark:border-slate-800" />

        {/* ── Q2: Current Level ────────────────────────────────── */}
        <fieldset>
          <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            <span className="flex size-5 items-center justify-center rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Q2
            </span>
            Current Level
          </legend>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Your engineering level based on independence/complexity
          </p>

          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            {(Object.entries(LEVEL_DEFINITIONS) as [EngineerLevel, string][]).map(([level, desc]) => {
              const selected = form.currentLevel === level
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, currentLevel: level }))}
                  className={`group flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                    selected
                      ? 'border-teal-300 bg-teal-50 shadow-sm dark:border-teal-700 dark:bg-teal-950/40'
                      : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/20'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selected
                        ? 'border-teal-500 bg-teal-500 dark:border-teal-400 dark:bg-teal-400'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold capitalize ${selected ? 'text-teal-800 dark:text-teal-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      {level}
                    </span>
                    <p className={`text-xs ${selected ? 'text-teal-600/80 dark:text-teal-300/70' : 'text-slate-400 dark:text-slate-500'}`}>
                      {desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Justification */}
          <textarea
            placeholder="Why this level? Describe the complexity and autonomy you've demonstrated..."
            value={form.justification}
            onChange={(e) => setForm((prev) => ({ ...prev, justification: e.target.value }))}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
          />
        </fieldset>

        {/* Divider */}
        <div className="border-t border-dashed border-slate-100 dark:border-slate-800" />

        {/* ── Q3: Growth Trajectory ────────────────────────────── */}
        <fieldset>
          <legend className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            <span className="flex size-5 items-center justify-center rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Q3
            </span>
            Growth Trajectory
          </legend>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            How has your skill level progressed since last period?
          </p>

          {/* Scale 1-5 */}
          <div className="mb-4 flex items-center gap-1.5 sm:gap-2">
            {([1, 2, 3, 4, 5] as GrowthTrajectoryRating[]).map((rating) => {
              const selected = form.growthTrajectory === rating
              const label = TRAJECTORY_LABELS[rating]
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, growthTrajectory: rating }))}
                  className={`group flex flex-1 flex-col items-center gap-1 rounded-lg border py-2.5 transition-all ${
                    selected
                      ? 'border-teal-300 bg-teal-50 shadow-sm dark:border-teal-700 dark:bg-teal-950/40'
                      : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/20'
                  }`}
                >
                  <span
                    className={`font-mono text-base font-bold ${
                      selected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {rating}
                  </span>
                  <span
                    className={`text-[10px] font-medium leading-none ${
                      selected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Target skill + plan */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Target skill for next period"
              value={form.targetSkill}
              onChange={(e) => setForm((prev) => ({ ...prev, targetSkill: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
            />
            <textarea
              placeholder="What will you target next? Describe your plan for 1 skill..."
              value={form.targetPlan}
              onChange={(e) => setForm((prev) => ({ ...prev, targetPlan: e.target.value }))}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
            />
          </div>
        </fieldset>

        {/* ── Submit ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {canSubmit ? 'Ready to submit' : 'Complete all fields to submit'}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              canSubmit
                ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-600'
                : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            }`}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
