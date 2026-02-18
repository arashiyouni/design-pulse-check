# Project Settings Specification

## Overview
Project Settings is the hub for managing projects, their client organization assignments, and all external integrations. Partners and project managers can create new projects via a guided wizard, assign them to client organizations, and connect GitHub repositories, Jira projects, and Linear teams for automated delivery metric tracking.

## User Flows
- **View project list**: Sortable/filterable table showing all projects with name, client organization, engineer count, integration status badges, and last activity. Search bar and filters for org and status.
- **Create new project**: Multi-step wizard — Step 1 (required): project name + client organization (select from pre-existing list, or mark as "Internal"). Steps 2–3 (optional, skippable): assign engineers/lead, connect integrations (GitHub, Jira, Linear).
- **Unified integrations tab**: Within a project's settings, a single "Integrations" area shows GitHub, Jira, and Linear as integration cards with connection status. Multiple trackers can be connected simultaneously. Clicking an integration opens its detail view.
- **GitHub integration**: Connect via GitHub App, manage repository linking, engineer-to-GitHub username mapping, and sync status monitoring.
- **Jira/Linear integration**: Placeholder connection cards showing "not connected" state. Connection flow TBD in later implementation. Once connected, shows linked project/team, sync status, and ticket counts.
- **Edit project**: Update project name, description, client organization assignment, or archive/deactivate a project.

## UI Requirements
- Project list uses table pattern consistent with Portfolio View (sortable columns, search, filters)
- "New Project" button in the header area opens the creation wizard
- Wizard uses a stepped modal/dialog — only name + org required, other steps skippable with "Skip" and "Finish" actions
- Client organization selector is a dropdown of pre-existing organizations
- Integration cards show: icon/logo, connection status (Connected / Not Connected / Error), last sync time, and a connect/manage action
- GitHub detail view preserves the existing component structure (repository list, engineer mapping, unmatched contributors, sync status bar)
- Jira and Linear detail views show a placeholder/coming-soon state for now
- Role-based access: Partners/PMs can create projects and manage integrations; Engineers can view their own project assignments only

## Configuration
- shell: true
