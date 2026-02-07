import { useState } from 'react'
import type { SelfAssessmentForm as SelfAssessmentFormData, EngineerOption, EngineerLevel } from '@/../product/sections/data-ingestion-and-signals/types'
import { Sparkles, X, Plus, Link2, Target } from 'lucide-react'

const skillSuggestions = [
  'System Design', 'Mentorship', 'Technical Writing', 'React Performance',
  'Testing Patterns', 'API Design', 'DevOps', 'Database Optimization',
  'Code Review', 'Architecture Reviews', 'Security', 'Accessibility',
]

const levelOptions: { value: EngineerLevel; label: string; description: string }[] = [
  { value: 'junior', label: 'Junior', description: 'Learning fundamentals, needs guidance on most tasks' },
  { value: 'mid', label: 'Mid', description: 'Works independently, owns features end-to-end' },
  { value: 'senior', label: 'Senior', description: 'Leads technical decisions, mentors others' },
  { value: 'staff', label: 'Staff', description: 'Sets technical direction across teams' },
]

interface SelfAssessmentFormProps {
  engineers: EngineerOption[]
  onSubmit?: (data: SelfAssessmentFormData) => void
}

export function SelfAssessmentForm({ engineers, onSubmit }: SelfAssessmentFormProps) {
  const [selectedEngineer, setSelectedEngineer] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [level, setLevel] = useState<EngineerLevel | ''>('')
  const [justification, setJustification] = useState('')
  const [trajectory, setTrajectory] = useState(3)
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([''])
  const [targetSkill, setTargetSkill] = useState('')

  const isValid = selectedEngineer && skills.length > 0 && level && justification.trim() && targetSkill.trim()

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill))
    } else if (skills.length < 3) {
      setSkills([...skills, skill])
    }
  }

  const addEvidenceUrl = () => {
    setEvidenceUrls([...evidenceUrls, ''])
  }

  const updateEvidenceUrl = (index: number, value: string) => {
    const updated = [...evidenceUrls]
    updated[index] = value
    setEvidenceUrls(updated)
  }

  const removeEvidenceUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!isValid || !level) return
    onSubmit?.({
      engineerId: selectedEngineer,
      skillsDemonstrated: skills,
      currentLevel: level,
      levelJustification: justification,
      growthTrajectory: trajectory,
      evidenceUrls: evidenceUrls.filter((u) => u.trim()),
      targetSkill,
    })
    // Reset
    setSelectedEngineer('')
    setSkills([])
    setLevel('')
    setJustification('')
    setTrajectory(3)
    setEvidenceUrls([''])
    setTargetSkill('')
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="size-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Self-Assessment</h3>
        </div>

        <div className="space-y-5">
          {/* Engineer selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Engineer</label>
            <select
              value={selectedEngineer}
              onChange={(e) => setSelectedEngineer(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-teal-600 dark:focus:ring-teal-600"
            >
              <option value="">Select an engineer...</option>
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name} — {eng.project} ({eng.level})
                </option>
              ))}
            </select>
          </div>

          {/* Skills multi-select chips */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Skills Demonstrated <span className="text-xs font-normal text-slate-400">(up to 3)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map((skill) => {
                const isSelected = skills.includes(skill)
                const isDisabled = !isSelected && skills.length >= 3
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    disabled={isDisabled}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                        : isDisabled
                          ? 'cursor-not-allowed bg-slate-50 text-slate-300 dark:bg-slate-800/50 dark:text-slate-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <span className="mr-1">&#10003;</span>}
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Current level */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Current Level</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {levelOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLevel(opt.value)}
                  className={`rounded-lg border-2 px-3 py-2 text-left transition-colors ${
                    level === opt.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950/30 dark:text-teal-300'
                      : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{opt.label}</span>
                  <span className="mt-0.5 block text-[10px] leading-tight opacity-60">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Level justification */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Level Justification</label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Why do you believe this level is accurate? Include specific examples..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
            />
          </div>

          {/* Growth trajectory */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Growth Trajectory</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500">Stagnant</span>
              <div className="flex flex-1 gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTrajectory(n)}
                    className={`flex h-10 flex-1 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                      n <= trajectory
                        ? 'bg-teal-600 text-white dark:bg-teal-500'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">Rapid</span>
            </div>
          </div>

          {/* Evidence URLs */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Evidence URLs <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <div className="space-y-2">
              {evidenceUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateEvidenceUrl(i, e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-600 dark:focus:ring-teal-600"
                    />
                  </div>
                  {evidenceUrls.length > 1 && (
                    <button
                      onClick={() => removeEvidenceUrl(i)}
                      className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEvidenceUrl}
                className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                <Plus className="size-3" />
                Add another URL
              </button>
            </div>
          </div>

          {/* Target skill */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Target Skill (next period)</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                placeholder="e.g., Architecture Reviews"
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
            Submit Self-Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
