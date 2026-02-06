# Needs Attention & Actions Specification

## Overview
Needs Attention & Actions is the proactive alert and follow-up system. It automatically flags engineers whose metrics cross defined thresholds — both single-metric triggers (e.g., PR cycle time > 72h) and combined-signal risk patterns (Slowdown Spiral, Complexity Avoidance, Silent Struggle, Blocked & Declining). Managers can create 1:1 action items tied to specific alerts and track resolution through a historical timeline.

## User Flows
- Manager opens the Needs Attention view and sees a prioritized list of flagged engineers, sorted by severity (Attention first, then Monitor)
- Manager reviews an alert card showing the engineer name, alert type, severity level (Monitor/Attention), trigger description, and which metrics are declining
- Manager clicks into an alert to see the full context: the engineer's affected pillar scores, sparkline trends, and the specific thresholds crossed
- Manager creates a 1:1 action item from an alert: describes the follow-up task, sets a due date, and optionally links it to a specific pillar or metric
- Manager views all open action items across their team, filtered by status (open/in progress/completed) and engineer
- Manager marks an action item as completed with a resolution note
- Manager reviews the historical timeline for an engineer showing all past alerts and action items chronologically, with resolution status
- System automatically generates alerts based on single-metric triggers (any metric declining 2+ consecutive periods, PR cycle time > 72h, deploy frequency < 0.1/day, investment mix declined > 25%)
- System detects combined-signal risk patterns: "Slowdown Spiral" (cycle time + deploy freq both declining), "Complexity Avoidance" (investment mix declining + fast small PRs), "Silent Struggle" (self-assessment low + delivery declining + client stable), "Blocked & Declining" (lead tagged Blocked + any delivery metric declining)

## UI Requirements
- Alert list view: cards sorted by severity, each showing engineer avatar/name, alert badge (Monitor yellow / Attention red), pattern name, trigger description, and affected metrics with mini-sparklines
- Alert detail view: full scorecard context for the flagged engineer with highlighted declining metrics, cross-signal analysis showing which pattern was matched
- Action item creation form: description textarea, due date picker, pillar/metric link selector, assign to self or another manager
- Action items list: table with columns for engineer, description, status badge (open/in progress/completed), due date, created by, and actions (edit/complete)
- Historical timeline: chronological feed showing alert triggers and action item resolutions with status changes, filterable by date range
- Alert severity badges: amber/yellow for Monitor, red for Attention
- Combined-signal pattern cards with visual indicator showing which metrics triggered the pattern
- Empty state messaging when no engineers need attention ("All clear — no attention flags this period")
- Responsive layout: stacked cards on mobile, list/table on desktop
- Light/dark mode support

## Configuration
- shell: true
