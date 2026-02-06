# Portfolio View Specification

## Overview
Portfolio View is the leadership dashboard that provides a bird's-eye view of the entire engineering roster (~200 engineers). It surfaces engineers sorted by "Needs Attention" signals, displays mini-sparklines for quick trend scanning, and allows drill-down into individual scorecards. Partners can filter by project, level, trend direction, and adjust pillar weighting to see scores recalculate live.

## User Flows
- Partner opens the Portfolio View and sees summary stats: total engineers, healthy count, monitor count, needs attention count — each with trend deltas
- Partner views the engineer roster table sorted by attention priority (declining trends first), showing name, project, composite score, 4 pillar mini-sparklines, overall trend, and attention flag
- Partner filters the roster by project, engineer level (Junior/Mid/Senior/Staff), trend direction (Improving/Stable/Declining), or attention status (Healthy/Monitor/Attention)
- Partner searches for a specific engineer by name
- Partner clicks on an engineer row to drill down into their full scorecard
- Partner switches between "Declining Trends", "Improving Trends", and "Stable Trends" grouped views with expandable engineer lists and counts
- Partner adjusts pillar weighting (e.g., Delivery 25% → 15%) and sees composite scores recalculate live across the roster
- Partner toggles between current and previous period to compare roster-level trends

## UI Requirements
- Summary stat cards at the top: Total Engineers, Healthy, Monitor, Needs Attention — each with a number (JetBrains Mono), trend delta badge, and color coding (teal/amber/red/slate)
- Engineer roster table with columns: name + avatar, project, composite score, 4 mini-sparklines (one per pillar), overall trend badge, attention flag badge
- Table sortable by composite score, any pillar score, or trend direction
- Filter bar with dropdowns for project, level, trend direction, and attention status
- Search input for engineer name
- Grouped view option: collapsible sections for "Declining Trends (N engineers)", "Improving Trends (N engineers)", "Stable Trends (N engineers)"
- Mini-sparklines in table cells: compact (80-100px wide), color-coded by trend direction
- Pillar weight configuration panel: sliders or inputs for each pillar weight that sum to 100%, with live score recalculation
- Period selector for comparing current vs. previous period
- Click-through on any engineer row navigates to their full scorecard
- Responsive: table converts to card list on mobile, filters become a sheet/drawer
- Light/dark mode support

## Configuration
- shell: true
