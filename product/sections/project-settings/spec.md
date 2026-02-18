# Project Settings Specification

## Overview
Project-level GitHub integration that connects repositories to track delivery metrics. Manages repository linking, engineer-to-GitHub username mapping, and sync status monitoring.

## User Flows
- **Connect GitHub App**: From disconnected state, user clicks "Connect GitHub" and is redirected to GitHub's App installation flow, then returns to see connected state
- **Manage repository list**: View granted repos, toggle which repos are actively linked to this project, add repos if installation scope expanded
- **Map engineers to GitHub**: Auto-match engineers to GitHub usernames, manually assign unmatched contributors, edit any mapping
- **Monitor sync health**: View last successful sync, number of PRs ingested, and any errors
- **Disconnect GitHub**: Remove linked repos and engineer mappings (does not uninstall App from org)

## UI Requirements
- **Disconnected state**: Empty state with explanation ("Link repositories to track delivery metrics for engineers on this project") and primary "Connect GitHub" button
- **Repository list**: Each row shows repo name, owning org, sync status (timestamp or error badge), toggle for active/inactive linking
- **Engineer mapping table**: Shows assigned engineers with GitHub username field, confirmed auto-matches, separate "unmatched contributors" section with assign/dismiss actions
- **Sync status indicator**: Compact card or status bar showing integration health, last sync time, PR count, errors
- **Disconnect action**: Destructive action in secondary or danger zone area
- **Role-based access**: Partners/PMs can connect/disconnect and manage linking; Engineers can view their own mapping only
- **Edge case states**: Installation pending, expired/revoked installation, zero repos linked

## Configuration
- shell: true
