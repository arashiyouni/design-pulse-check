import { useState } from 'react'
import { Sparkles, RefreshCw, Loader2, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import type { ScoreAnalysis, Engineer, PulseScore } from '@/../product/sections/engineer-scorecard/types'
import { generateScoreAnalysis } from './gemini-service'

type AnalysisState = 'idle' | 'loading' | 'error' | 'result'

interface ScoreAnalysisCardProps {
  engineer: Engineer
  pulseScore: PulseScore
  apiKey: string
  onAnalysisGenerated?: (analysis: ScoreAnalysis) => void
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

export function ScoreAnalysisCard({ engineer, pulseScore, apiKey, onAnalysisGenerated }: ScoreAnalysisCardProps) {
  const [state, setState] = useState<AnalysisState>('idle')
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setState('loading')
    setError(null)
    try {
      const result = await generateScoreAnalysis(apiKey, engineer, pulseScore)
      setAnalysis(result)
      setState('result')
      onAnalysisGenerated?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis')
      setState('error')
    }
  }

  // ── Idle State ──
  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <Sparkles className="mb-3 size-8 text-slate-400 dark:text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Score Analysis</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Get AI-powered insights on performance, strengths, and action items.
        </p>
        <button
          onClick={handleGenerate}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          <Sparkles className="size-4" />
          Generate Analysis
        </button>
      </div>
    )
  }

  // ── Loading State ──
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <Loader2 className="mb-3 size-8 animate-spin text-teal-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analyzing Scores…</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Gemini is reviewing pillar data, trends, and feedback.
        </p>
      </div>
    )
  }

  // ── Error State ──
  if (state === 'error') {
    return (
      <div className="flex flex-col justify-center rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Analysis Failed</h3>
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={handleGenerate}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
            >
              <RefreshCw className="size-3.5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Result State ──
  if (!analysis) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-teal-500" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI Score Analysis</h3>
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <RefreshCw className="size-3" />
          Regenerate
        </button>
      </div>

      <div className="space-y-5 p-5">
        {/* Overall Assessment */}
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {analysis.overallAssessment}
        </p>

        {/* Strengths */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="size-3.5 text-teal-500" />
            Strengths
          </h4>
          <ul className="space-y-1.5">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <AlertTriangle className="size-3.5 text-amber-500" />
            Areas for Improvement
          </h4>
          <ul className="space-y-1.5">
            {analysis.areasForImprovement.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                {area}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <ArrowRight className="size-3.5 text-slate-400" />
            Action Items
          </h4>
          <div className="space-y-2">
            {analysis.actionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.action}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.pillar}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${priorityStyles[item.priority] ?? priorityStyles.low}`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
