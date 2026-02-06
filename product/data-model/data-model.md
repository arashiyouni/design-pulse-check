# Data Model

## Entities

### User
Anyone who logs into Pulse Check. Has a role that determines what they can see and do: engineer (sees own scorecard), lead/PM (submits check-ins, views team), or partner/leadership (portfolio-level access).

### Engineer
A Ravn engineer placed on a client project. The central subject of every scorecard. Has a level (Junior, Mid, Senior, Staff) and is assigned to one or more projects.

### Project
A client engagement that engineers are assigned to. Groups engineers by client context and scopes survey and check-in data to the right placement.

### PulseScore
A period-based composite score (e.g., "2026-02") for one engineer. Combines the 4 weighted pillar scores (Client Satisfaction, Team Feedback, Growth, Delivery) into a single Composite Pulse Score with an overall trend direction (Improving, Stable, Declining).

### DeliveryMetric
Automated delivery data for one engineer in one period. Captures PR cycle time (median hours), deployment frequency (deploys per day), and investment mix (ticket complexity score). Each sub-metric has its own 0-100 score and trend direction. Sourced from GitHub and Jira via daily cron.

### ClientSurvey
A bi-weekly pulse survey response from a client about an engineer. Captures NPS score (1-5) and CSAT score (1-5), plus optional contextual questions and open-text feedback.

### LeadCheckIn
A lightweight status check-in submitted by a team lead or PM about an engineer for a given period. Contains a status tag (Growing, Stable, or Blocked), an optional numeric score (1-5), free-text notes, and an evidence URL linking to a specific PR or ticket.

### SelfAssessment
An engineer's self-reported growth data for a period. Includes skills demonstrated (multi-select up to 3), current level assessment with justification, growth trajectory rating (1-5), evidence URLs linking to PRs and design docs, and a target skill for the next period.

### Alert
A "Needs Attention" flag triggered automatically when an engineer's metrics cross defined thresholds. Can be a single-metric trigger (e.g., PR cycle time > 72h sustained) or a combined-signal risk pattern (e.g., "Slowdown Spiral", "Complexity Avoidance", "Silent Struggle"). Has a severity level (Monitor or Attention).

### ActionItem
A follow-up task created by a manager in response to a scorecard signal or alert. Tied to a specific engineer and optionally to a specific pillar or alert. Tracks status (open, in progress, completed) and due date.

## Relationships

- User has one Engineer profile (if they are an engineer)
- Engineer belongs to one or more Project
- Engineer has many PulseScore (one per period)
- Engineer has many DeliveryMetric (one per period)
- Engineer has many ClientSurvey (multiple per period from different clients)
- Engineer has many LeadCheckIn (from different leads/PMs per period)
- Engineer has many SelfAssessment (one per period)
- Engineer has many Alert
- Engineer has many ActionItem
- PulseScore references DeliveryMetric, ClientSurvey, LeadCheckIn, and SelfAssessment for the same period
- LeadCheckIn belongs to both Engineer and Project
- ClientSurvey belongs to both Engineer and Project
- Alert may trigger one or more ActionItem
- ActionItem belongs to Engineer and is created by a User (manager)
