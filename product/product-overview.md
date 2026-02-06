# Pulse Check

## Description
Pulse Check is a multi-signal scorecard platform that blends automated delivery metrics (GitHub/Jira) with qualitative signals (client surveys, peer/lead feedback, self-assessments) to produce a holistic view of engineer health across ~200 placements at Ravn. It is a compass, not a surveillance tool — every metric tracked is visible to the engineer.

## Problems & Solutions

### Problem 1: No Systematic Visibility into Engineer Health
A Composite Pulse Score per engineer combining 4 weighted pillars (Client Satisfaction, Team Feedback, Growth, Delivery), each with sparkline trend visualization showing trajectory over time.

### Problem 2: Engineers Blindsided by Performance Reviews
Full transparency — engineers see the same scorecards, sparklines, and trend data that their managers see, in real-time.

### Problem 3: Managers Rely on Gut Feel and Ad-Hoc Feedback
Automated "Needs Attention" alerts flag declining trends (e.g., 2+ consecutive periods of decline, combined-signal patterns like "Slowdown Spiral" or "Silent Struggle") so managers can intervene proactively.

### Problem 4: No Objective Record of Engineer Growth
Evidence-based growth tracking with self-assessments, skill progression, and evidence URLs linking to PRs, design docs, and mentorship artifacts.

### Problem 5: Feedback Loops Are Too Slow and Fragmented
Bi-weekly client pulse surveys (NPS/CSAT), lightweight lead check-ins (Growing/Stable/Blocked status tags), and daily automated delivery metric syncs create continuous, multi-source signal flow.

## Key Features
- Composite Pulse Score — weighted average of 4 pillars with configurable weights per pillar
- Sparkline trend visualization — color-coded trajectory (green/gray/red) with period-over-period comparison
- Automated delivery metrics — PR cycle time, deployment frequency, and investment mix (ticket complexity) via GitHub/Jira daily cron
- Client pulse surveys — bi-weekly NPS + CSAT with sparkline trends
- Lead check-in system — one-click status tags (Growing/Stable/Blocked) with aggregated scores and notes
- Self-assessment with evidence — skill multi-select, leveling (Junior/Mid/Senior/Staff), and evidence URL linking
- "Needs Attention" alert system — automatic flags based on single-metric thresholds and combined-signal risk patterns
- 1:1 action items — managers can create follow-up actions tied to specific scorecard signals
- Historical timeline — full audit trail showing how an engineer's health evolved over months/quarters
- Portfolio view — leadership dashboard of entire roster sorted by attention signals with drill-down
- Landing page — public-facing page explaining the Pulse Check platform
