import type { PillarWeight } from '@/../product/sections/portfolio-view/types'
import { SlidersHorizontal } from 'lucide-react'

interface WeightPanelProps {
  weights: PillarWeight[]
  onWeightChange?: (pillarId: string, weight: number) => void
}

export function WeightPanel({ weights, onWeightChange }: WeightPanelProps) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Pillar Weights</h3>
        <span className={`ml-auto font-mono text-xs font-medium ${total === 100 ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
          {total}%
        </span>
      </div>

      <div className="space-y-4">
        {weights.map((w) => (
          <div key={w.pillarId}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{w.pillarName}</span>
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">{w.weight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={w.weight}
              onChange={(e) => onWeightChange?.(w.pillarId, Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-500 dark:bg-slate-700 dark:accent-teal-400
                [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:shadow-md dark:[&::-webkit-slider-thumb]:bg-teal-400"
            />
          </div>
        ))}
      </div>

      {total !== 100 && (
        <p className="mt-3 text-xs text-red-500 dark:text-red-400">
          Weights must sum to 100% (currently {total}%)
        </p>
      )}
    </div>
  )
}
