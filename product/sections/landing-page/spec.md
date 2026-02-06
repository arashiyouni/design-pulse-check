# Landing Page Specification

## Overview
A public-facing page that introduces Pulse Check to prospective users and stakeholders. It communicates the core philosophy ("Transparency over Surveillance"), explains the 4-pillar scorecard model, shows who it's for (Engineers, Leads, Partners), and drives sign-up or demo requests. The aesthetic is warm and human — not "Police Dashboard."

## User Flows
- Visitor lands on the page, reads the hero tagline and value proposition
- Visitor scrolls through the 4-pillar breakdown to understand how scoring works
- Visitor sees the 3 user personas (Engineer, Lead/PM, Partner) and what each gets from the platform
- Visitor clicks the primary CTA to request a demo or sign up

## UI Requirements
- Hero section with headline ("A compass, not a surveillance tool"), one-liner description, and primary CTA button
- "The Problem" section — brief statement about the visibility gap at scale (~200 engineers, gut feel, ad-hoc feedback)
- 4-Pillar visual breakdown — Client Satisfaction, Team Feedback, Growth, Delivery — each with an icon, title, and one-sentence description showing surveys, status tags, self-assessments, and automated GitHub/Jira metrics
- "Transparency over Surveillance" philosophy section — emphasize that every metric tracked is visible to the engineer
- 3 persona cards (Engineer, Lead/PM, Partner/Leadership) showing what each role sees and does
- Social proof or stats section (e.g., "200+ engineers tracked", "4 signal pillars", "Real-time trends")
- Footer CTA with sign-up / request demo button
- Responsive layout — single column on mobile, multi-column feature grids on desktop
- Light/dark mode support
- Uses teal/amber/slate design tokens and Inter + JetBrains Mono typography

## Configuration
- shell: false
