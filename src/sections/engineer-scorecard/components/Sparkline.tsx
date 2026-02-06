import type { SparklinePoint, TrendDirection } from '@/../product/sections/engineer-scorecard/types'

const trendColors: Record<TrendDirection, { stroke: string; fill: string; dot: string }> = {
  improving: {
    stroke: 'stroke-teal-500 dark:stroke-teal-400',
    fill: 'fill-teal-500/10 dark:fill-teal-400/10',
    dot: 'fill-teal-500 dark:fill-teal-400',
  },
  stable: {
    stroke: 'stroke-slate-400 dark:stroke-slate-500',
    fill: 'fill-slate-400/10 dark:fill-slate-500/10',
    dot: 'fill-slate-400 dark:fill-slate-500',
  },
  declining: {
    stroke: 'stroke-red-500 dark:stroke-red-400',
    fill: 'fill-red-500/10 dark:fill-red-400/10',
    dot: 'fill-red-500 dark:fill-red-400',
  },
}

interface SparklineProps {
  data: SparklinePoint[]
  trend: TrendDirection
  width?: number
  height?: number
  showArea?: boolean
}

export function Sparkline({
  data,
  trend,
  width = 120,
  height = 36,
  showArea = true,
}: SparklineProps) {
  if (data.length < 2) return null

  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const padding = { top: 6, bottom: 6, left: 2, right: 2 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - min) / range) * chartHeight,
  }))

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`

  const lastPoint = points[points.length - 1]
  const colors = trendColors[trend]

  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden="true">
      {/* Area fill */}
      {showArea && (
        <path d={areaPath} className={colors.fill} />
      )}

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={colors.stroke}
      />

      {/* Current value dot (larger) */}
      <circle cx={lastPoint.x} cy={lastPoint.y} r={3} className={colors.dot} />

      {/* Previous points (smaller) */}
      {points.slice(0, -1).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.5} className={colors.dot} opacity={0.4} />
      ))}
    </svg>
  )
}
