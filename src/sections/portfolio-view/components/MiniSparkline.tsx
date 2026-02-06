import type { SparklinePoint, TrendDirection } from '@/../product/sections/portfolio-view/types'

const trendStrokes: Record<TrendDirection, string> = {
  improving: 'stroke-teal-500 dark:stroke-teal-400',
  stable: 'stroke-slate-400 dark:stroke-slate-500',
  declining: 'stroke-red-500 dark:stroke-red-400',
}

const trendDots: Record<TrendDirection, string> = {
  improving: 'fill-teal-500 dark:fill-teal-400',
  stable: 'fill-slate-400 dark:fill-slate-500',
  declining: 'fill-red-500 dark:fill-red-400',
}

interface MiniSparklineProps {
  data: SparklinePoint[]
  trend: TrendDirection
  width?: number
  height?: number
}

export function MiniSparkline({ data, trend, width = 80, height = 24 }: MiniSparklineProps) {
  if (data.length < 2) return null

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const pad = { top: 4, bottom: 4, left: 2, right: 2 }
  const cw = width - pad.left - pad.right
  const ch = height - pad.top - pad.bottom

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * cw,
    y: pad.top + ch - ((d.value - min) / range) * ch,
  }))

  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  const last = pts[pts.length - 1]

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <path d={path} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={trendStrokes[trend]} />
      <circle cx={last.x} cy={last.y} r={2.5} className={trendDots[trend]} />
    </svg>
  )
}
