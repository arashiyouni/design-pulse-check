# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Design OS

Design OS is a **product planning and design tool** — not the end product itself. It helps users define their product vision, data model, design system, and UI, then exports everything as a handoff package for implementation in a separate codebase. See `agents.md` for the full planning flow, file structure, design requirements, and export details.

## Development Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Type-check (tsc -b) then build with Vite
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test runner is configured.

## Architecture

**Tech stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + React Router v7 + Radix UI + shadcn/ui components

**Path alias:** `@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.json`)

### Two Distinct Contexts

1. **Design OS Application** (`src/components/`, `src/lib/`) — The planning tool UI itself. Always uses stone/lime palette and DM Sans typography.
2. **Product Screen Designs** (`src/sections/[section-id]/`, `src/shell/`) — The product being designed. Uses design tokens from `product/design-system/`. These components are exportable and must accept all data via props.

### Routing (`src/lib/router.tsx`)

| Route | Purpose |
|---|---|
| `/` | Product overview & roadmap |
| `/data-model` | Data model definition |
| `/design` | Design system & shell |
| `/sections` | Sections list |
| `/sections/:sectionId` | Single section (spec, data, screens, screenshots) |
| `/sections/:sectionId/screen-designs/:screenDesignName` | Screen preview with resizable viewport |
| `/sections/:sectionId/screen-designs/:screenDesignName/fullscreen` | Fullscreen preview |
| `/shell/design` | Shell preview |
| `/export` | Export package generation |

### File-Based Data Loading

All product data lives in `product/` as markdown and JSON, loaded at build time via `import.meta.glob()`:

- `src/lib/product-loader.ts` — Parses `product-overview.md` and `product-roadmap.md`
- `src/lib/section-loader.ts` — Parses section specs, loads data.json, lazy-loads screen design components from `src/sections/`
- `src/lib/design-system-loader.ts` — Loads `colors.json` and `typography.json`
- `src/lib/data-model-loader.ts` — Parses `data-model.md` entities and relationships
- `src/lib/shell-loader.ts` — Parses shell spec, lazy-loads shell components from `src/shell/`

Screen design components are **lazy-loaded** — the loader discovers `.tsx` files via glob patterns and imports them dynamically.

### Key Types (`src/types/`)

- `product.ts` — `ProductOverview`, `Section`, `DataModel`, `DesignSystem`, `ShellInfo`, `ProductData`
- `section.ts` — `SectionData`, `ParsedSpec`, `ScreenDesignInfo`, `ScreenshotInfo`

### Phase Navigation

The app guides users through 5 phases: Product → Data Model → Design → Sections → Export. The `PhaseNav` component tracks completion status across phases.

## Tailwind CSS v4 Rules

- **No `tailwind.config.js`** — Tailwind v4 does not use config files. Never create one.
- **Use built-in utility classes and colors only** — No custom CSS or custom color definitions.
- **Dark mode** — Use `dark:` variants. The `@custom-variant dark` directive is set in `src/index.css`.
- **Responsive** — Use `sm:`, `md:`, `lg:`, `xl:` prefixes for responsive layouts.

## Screen Design Component Rules

- Accept all data and callbacks via props — never import data directly
- Do not include navigation chrome — the shell handles navigation
- Support both light and dark mode
- Use product design tokens when available; fall back to stone/lime
- Optionally wrapped in AppShell (controlled by `shell: false` in section spec)

## Section ID Slugification

Section IDs are auto-generated from titles in `product-loader.ts`: lowercase, `" & "` → `"-and-"`, special characters removed, leading/trailing hyphens trimmed.
