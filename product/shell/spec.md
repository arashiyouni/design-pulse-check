# Application Shell Specification

## Overview
Pulse Check uses a Notion-style shell with a hidden sidebar and persistent top bar. The sidebar is hidden by default and slides in from the left on hover (peek) or toggle (pin). The top bar is always visible and provides product branding, a period selector, and user menu. This pattern maximizes content space for data-dense scorecards while keeping navigation instantly accessible.

## Navigation Structure
- Dashboard → Home overview
- Engineer Scorecard → Individual scorecard view
- Data & Signals → Signal management and ingestion
- Needs Attention → Alerts and action items
- Portfolio View → Leadership roster dashboard
- Settings → Configuration and preferences

## User Menu
Located in the top bar, right side. Contains avatar, user name, role badge, and dropdown with profile, preferences, and logout options.

## Layout Pattern
- **Sidebar:** Hidden by default. Slides in as an overlay on hover at the left edge or when toggled via hamburger button. Can be pinned open. Does not push content.
- **Top bar:** Always visible. Fixed to top. Contains hamburger toggle, product logo, period selector, notification bell, and user avatar menu.
- **Content area:** Full width when sidebar is hidden. Scrollable independently.

## Responsive Behavior
- **Desktop:** Sidebar hidden, peeks on left-edge hover, pinnable. Top bar fixed.
- **Tablet:** Sidebar hidden, hamburger toggle only (no hover peek). Top bar fixed.
- **Mobile:** Sidebar opens as full-screen overlay drawer via hamburger. Top bar simplified (logo + hamburger + avatar).

## Design Notes
- Design tokens: teal (primary), amber (secondary), slate (neutral)
- Typography: Inter for all UI text, JetBrains Mono for metrics/data
- Active nav item highlighted with teal-500 accent
- Sidebar has subtle backdrop blur when overlaying content
- Smooth slide-in animation (200ms ease-out)
- Period selector in top bar allows switching between monthly periods
