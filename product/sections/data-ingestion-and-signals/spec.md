# Data Ingestion & Signals Specification

## Overview
Data Ingestion & Signals is the signal management hub where all 4 pillar data sources are configured, monitored, and submitted. It provides admin views for managing automated integrations (GitHub, Jira/Linear), a survey management interface for client pulse surveys, and input forms for qualitative signals (lead check-ins and engineer self-assessments).

## User Flows
- Admin connects GitHub via OAuth and configures which repositories/orgs to track for PR data ingestion
- Admin connects Jira/Linear and maps projects to engineer assignments for ticket data
- Admin views the ingestion dashboard showing last sync time, data freshness, and error status for each automated source
- Admin creates and manages bi-weekly client pulse survey campaigns — selecting engineers, clients, and triggering email delivery
- Client receives a survey email, clicks through, and submits NPS (1-5) and CSAT (1-5) scores with optional open-text feedback
- Lead/PM opens the check-in form, selects an engineer, tags their status (Growing/Stable/Blocked), adds an optional score (1-5), notes, and evidence URL
- Engineer opens the self-assessment form, selects skills demonstrated (multi-select up to 3), self-reports their current level (Junior/Mid/Senior/Staff) with justification, rates their growth trajectory (1-5), attaches evidence URLs, and sets a target skill for next period
- Admin views a signal activity log showing all recent submissions across all sources

## UI Requirements
- Integration cards for GitHub and Jira/Linear: connection status, last sync time, repo/project count, and configure/disconnect buttons
- Ingestion health dashboard: status indicators (green/amber/red) per source, last successful sync timestamp, record counts per period
- Survey management table: list of survey campaigns with status (draft/sent/completed), response rate, and actions (send/view results)
- Survey response form (standalone page for clients): clean, minimal form with NPS scale, CSAT scale, and optional text fields — branded with Pulse Check identity
- Lead check-in form: engineer selector dropdown, status tag radio buttons (Growing/Stable/Blocked), optional score slider (1-5), notes textarea, evidence URL input
- Self-assessment form: skills multi-select chips (up to 3), level dropdown with descriptions, growth trajectory scale (1-5), evidence URL inputs (multiple), target skill text input
- Signal activity log: chronological feed with filter by type (delivery/survey/check-in/self-assessment), showing who submitted, when, and a preview of the data
- All forms use shadcn components (Input, Label, Select, Tabs, Card)
- Responsive layout with form views optimized for both desktop and mobile
- Light/dark mode support

## Configuration
- shell: true
