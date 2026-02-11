import type { PillarScore } from '@/../product/sections/engineer-scorecard/types'

interface RadarChartProps {
  pillars: PillarScore[]
}

export function RadarChart({ pillars }: RadarChartProps) {
  // Calculate the polygon points for the radar chart
  const centerX = 120
  const centerY = 120
  const maxRadius = 100
  const numPillars = pillars.length

  const getPoint = (index: number, value: number, radius: number) => {
    const angle = (Math.PI * 2 * index) / numPillars - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  // Create grid circles
  const gridLevels = [20, 40, 60, 80, 100]
  
  // Create data polygon
  const dataPoints = pillars.map((pillar, i) => getPoint(i, pillar.score, maxRadius))
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  // Create axis lines and labels
  const axes = pillars.map((pillar, i) => {
    const endPoint = getPoint(i, 100, maxRadius)
    const labelPoint = getPoint(i, 100, maxRadius + 25)
    return { pillar, endPoint, labelPoint, index: i }
  })

  return (
    <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50">
      <svg width="280" height="280" viewBox="0 0 240 240" className="overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level) => {
          const r = (level / 100) * maxRadius
          return (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-200 dark:text-slate-700"
              opacity="0.5"
            />
          )
        })}

        {/* Axis lines */}
        {axes.map(({ endPoint }, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-200 dark:text-slate-700"
            opacity="0.5"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={dataPolygon}
          fill="currentColor"
          className="text-teal-500 dark:text-teal-400"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="currentColor"
            className="text-teal-600 dark:text-teal-400"
          />
        ))}

        {/* Labels */}
        {axes.map(({ pillar, labelPoint, index }) => {
          const angle = (Math.PI * 2 * index) / numPillars - Math.PI / 2
          let textAnchor: 'start' | 'middle' | 'end' = 'middle'
          
          if (Math.cos(angle) > 0.1) textAnchor = 'start'
          else if (Math.cos(angle) < -0.1) textAnchor = 'end'

          return (
            <g key={index}>
              <text
                x={labelPoint.x}
                y={labelPoint.y - 8}
                textAnchor={textAnchor}
                className="fill-slate-600 text-xs font-medium dark:fill-slate-400"
              >
                {pillar.pillarName}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 6}
                textAnchor={textAnchor}
                className="fill-slate-900 text-sm font-bold dark:fill-white"
              >
                {pillar.score}
              </text>
            </g>
          )
        })}

        {/* Center score */}
        <circle
          cx={centerX}
          cy={centerY}
          r="20"
          fill="currentColor"
          className="text-white dark:text-slate-900"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-teal-500 dark:text-teal-400"
        />
      </svg>
    </div>
  )
}
