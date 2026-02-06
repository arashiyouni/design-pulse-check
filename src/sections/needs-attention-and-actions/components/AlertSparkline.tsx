import type { SparklinePoint, TrendDirection } from '@/../product/sections/needs-attention-and-actions/types'

const colors: Record<TrendDirection, { stroke: string; dot: string }> = {
  improving: { stroke: 'stroke-teal-500 dark:stroke-teal-400', dot: 'fill-teal-500 dark:fill-teal-400' },
  stable: { stroke: 'stroke-slate-400 dark:stroke-slate-500', dot: 'fill-slate-400 dark:fill-slate-500' },
  declining: { stroke: 'stroke-red-500 dark:stroke-red-400', dot: 'fill-red-500 dark:fill-red-400' },
}

interface AlertSparklineProps {
  data: SparklinePoint[]
  trend: TrendDirection
  width?: number
  height?: number
}

export function AlertSparkline({ data, trend, width = 80, height = 24 }: AlertSparklineProps) {
  if (data.length < 2) return null

  const vals = data.map((d) => d.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1

  const pad = { t: 4, b: 4, l: 2, r: 2 }
  const cw = width - pad.l - pad.r
  const ch = height - pad.t - pad.b

  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * cw,
    y: pad.t + ch - ((d.value - min) / range) * ch,
  }))

  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  const last = pts[pts.length - 1]
  const c = colors[trend]

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <path d={path} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={c.stroke} />
      <circle cx={last.x} cy={last.y} r={2.5} className={c.dot} />
    </svg>
  )
}
