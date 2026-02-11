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
import { ChevronDown, Check, Link, Send } from 'lucide-react'

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

export function SelfAssessmentWizard({ data, period, onSubmit }: SelfAssessmentFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  const [form, setForm] = useState<SelfAssessmentFormData>(
    data ?? { ...EMPTY_FORM, period }
  )

  const toggleSection = (section: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

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
    onSubmit?.(submitted)
  }

  const canSubmit =
    form.skillsDemonstrated.length > 0 &&
    form.evidenceUrl.trim() !== '' &&
    form.justification.trim() !== '' &&
    form.targetSkill.trim() !== '' &&
    form.targetPlan.trim() !== ''

  // Check completion status for each section
  const section1Complete = form.skillsDemonstrated.length > 0 && form.evidenceUrl.trim() !== ''
  const section2Complete = form.justification.trim() !== ''
  const section3Complete = form.targetSkill.trim() !== '' && form.targetPlan.trim() !== ''

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Self-Assessment</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Complete your growth assessment for {period}</p>
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {/* Q1: Skills Demonstrated */}
        <div className="p-6">
          <button
            type="button"
            onClick={() => toggleSection(0)}
            className="flex w-full items-start justify-between gap-4 text-left"
          >
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    section1Complete
                      ? 'bg-teal-600 text-white dark:bg-teal-500'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {section1Complete ? <Check className="size-3.5" /> : '1'}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Q1: Skills Demonstrated
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    "Which new skills have you applied this period?"
                  </h4>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`size-5 shrink-0 text-slate-400 transition-transform ${
                expandedSections.has(0) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.has(0) && (
            <div className="ml-9 mt-4 space-y-4">
              {/* Multi-select Skills */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Select up to 3 skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => {
                    const selected = form.skillsDemonstrated.includes(skill as SkillOption)
                    const disabled = !selected && form.skillsDemonstrated.length >= 3
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill as SkillOption)}
                        disabled={disabled}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          selected
                            ? 'border-teal-300 bg-teal-50 text-teal-700 shadow-sm dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                            : disabled
                              ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-teal-800 dark:hover:bg-teal-950/30'
                        }`}
                      >
                        {selected && <Check className="-ml-1 mr-1 inline size-4" />}
                        {skill}
                      </button>
                    )
                  })}
                </div>
                {form.skillsDemonstrated.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {form.skillsDemonstrated.length} of 3 selected
                  </p>
                )}
              </div>

              {/* Evidence URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Evidence URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://github.com/your-org/repo/pull/123"
                    value={form.evidenceUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, evidenceUrl: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Link to PR, design doc, demo, or other proof of work
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Q2: Current Level */}
        <div className="p-6">
          <button
            type="button"
            onClick={() => toggleSection(1)}
            className="flex w-full items-start justify-between gap-4 text-left"
          >
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    section2Complete
                      ? 'bg-teal-600 text-white dark:bg-teal-500'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {section2Complete ? <Check className="size-3.5" /> : '2'}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Q2: Current Level
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    "Your engineering level based on independence/complexity"
                  </h4>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`size-5 shrink-0 text-slate-400 transition-transform ${
                expandedSections.has(1) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.has(1) && (
            <div className="ml-9 mt-4 space-y-4">
              {/* Level Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Select your current level
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.entries(LEVEL_DEFINITIONS) as [EngineerLevel, string][]).map(([level, desc]) => {
                    const selected = form.currentLevel === level
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, currentLevel: level }))}
                        className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                          selected
                            ? 'border-teal-300 bg-teal-50 shadow-sm dark:border-teal-700 dark:bg-teal-950/40'
                            : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/20'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            selected
                              ? 'border-teal-500 bg-teal-500 dark:border-teal-400 dark:bg-teal-400'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {selected && <div className="size-2 rounded-full bg-white" />}
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
              </div>

              {/* Justification */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Why this level? <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the complexity and autonomy you've demonstrated. Include specific examples of your work, decision-making authority, and impact on the team..."
                  value={form.justification}
                  onChange={(e) => setForm((prev) => ({ ...prev, justification: e.target.value }))}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Be specific about complexity, independence, and impact
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Q3: Growth Trajectory */}
        <div className="p-6">
          <button
            type="button"
            onClick={() => toggleSection(2)}
            className="flex w-full items-start justify-between gap-4 text-left"
          >
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    section3Complete
                      ? 'bg-teal-600 text-white dark:bg-teal-500'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {section3Complete ? <Check className="size-3.5" /> : '3'}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Q3: Growth Trajectory
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    "How has your skill level progressed since last period?"
                  </h4>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`size-5 shrink-0 text-slate-400 transition-transform ${
                expandedSections.has(2) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.has(2) && (
            <div className="ml-9 mt-4 space-y-4">
              {/* Growth Scale */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rate your growth (1-5 scale)
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as GrowthTrajectoryRating[]).map((rating) => {
                    const selected = form.growthTrajectory === rating
                    const label = TRAJECTORY_LABELS[rating]
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, growthTrajectory: rating }))}
                        className={`flex flex-1 flex-col items-center gap-1.5 rounded-lg border py-3 transition-all ${
                          selected
                            ? 'border-teal-300 bg-teal-50 shadow-sm dark:border-teal-700 dark:bg-teal-950/40'
                            : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/20'
                        }`}
                      >
                        <span
                          className={`font-mono text-lg font-bold ${
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
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  1=Declined · 2=Same · 3=Slight · 4=Strong · 5=Significant
                </p>
              </div>

              {/* Target Skill & Plan */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    What will you target next? (1 skill) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., System Design, Mentoring, DevOps..."
                    value={form.targetSkill}
                    onChange={(e) => setForm((prev) => ({ ...prev, targetSkill: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your development plan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Describe your plan to develop this skill. What resources will you use? What projects will you apply it to? What's your timeline?"
                    value={form.targetPlan}
                    onChange={(e) => setForm((prev) => ({ ...prev, targetPlan: e.target.value }))}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-500 dark:focus:border-teal-700 dark:focus:ring-teal-900/40"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Include specific actions, resources, and timeline
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
            canSubmit
              ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
              : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
          }`}
        >
          <Send className="size-4" />
          Submit Assessment
        </button>
      </div>
    </div>
  )
}
