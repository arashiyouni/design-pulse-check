# Engineer Scorecard Specification

## Overview
The Engineer Scorecard is the core experience of Pulse Check — a personal dashboard that displays an engineer's Composite Pulse Score calculated from 4 weighted pillars (Client Satisfaction, Team Feedback, Growth, Delivery). It provides sparkline trend visualization, period-over-period comparison, and a historical timeline. Every metric shown to managers is also visible to the engineer — full transparency.

## User Flows
- Engineer opens their scorecard and sees the Composite Pulse Score prominently displayed with an overall trend indicator (Improving/Stable/Declining)
- Engineer reviews the 4 pillar breakdown cards, each showing a pillar score (0-100), sparkline trend over the last 3-6 periods, and a trend badge
- Engineer expands the Delivery pillar to see sub-metrics: PR Cycle Time (median hours), Deployment Frequency (deploys/day), and Investment Mix (complexity score) — each with its own sparkline
- Engineer views Client Satisfaction details: latest NPS and CSAT scores with sparkline trends
- Engineer views Team Feedback details: aggregated Lead Check-In status (Growing/Stable/Blocked) with notes and evidence links
- Engineer views Growth details: self-assessment data, current level (Junior/Mid/Senior/Staff), skills demonstrated, and evidence URLs
- Engineer toggles between current and previous period to compare scores side-by-side
- Engineer scrolls the historical timeline showing all signals chronologically (surveys, check-ins, self-assessments, alerts)
- Manager views the same scorecard for any engineer on their team with identical data visibility

## UI Requirements
- Composite Pulse Score displayed prominently as a large number with color-coded trend badge (green = improving, gray = stable, red = declining)
- 4 pillar cards in a responsive grid (2x2 on desktop, stacked on mobile), each showing pillar name, score, sparkline, and trend direction
- Sparkline component: 120px wide compact / 200px expanded, 3-6 data points, color-coded by trend (green-500 improving, gray-500 stable, red-500 declining), current value highlighted with larger dot
- Delivery pillar expandable to show 3 sub-metric sparkline cards (PR Cycle Time, Deployment Frequency, Investment Mix)
- Period selector toggle in the scorecard header (e.g., "Feb 2026" / "Jan 2026") for side-by-side comparison view
- Period comparison layout: two columns showing metrics from each period with delta percentages
- Historical timeline at the bottom: chronological feed of all signals with type icons, dates, and drill-down to details
- Engineer profile header: name, avatar, role/level, project assignment, and current period
- All scores use JetBrains Mono for numeric values, Inter for labels
- Uses teal for healthy/positive signals, amber for warning/monitor, red for declining/attention, slate for neutral/stable
- Responsive: stacked cards on mobile, grid layout on desktop
- Light/dark mode support

## Configuration
- shell: true
