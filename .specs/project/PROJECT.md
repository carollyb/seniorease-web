# SeniorEase

**Vision:** SeniorEase is a Next.js web platform that helps older adults manage academic and professional routines with autonomy, confidence, and digital inclusion. The product prioritizes readable interfaces, predictable flows, guided actions, and persistent personalization.
**For:** Older adults who need support organizing studies, professional activities, reminders, and digital preferences.
**Solves:** Digital tools often assume high familiarity, dense screens, and small interaction targets; SeniorEase reduces that friction with accessibility-first personalization and simplified task organization.

## Goals

- Enable users to adjust font size, contrast, spacing, navigation mode, visual feedback, and extra confirmations in less than 2 minutes.
- Allow users to create, follow, complete, and review simplified activities with clear language and positive completion feedback.
- Persist user preferences across sessions so the experience remains stable after refresh or return.
- Establish a clean, testable frontend architecture with isolated domain rules, use cases independent from UI, adapters, and CI validation.
- Meet practical accessibility needs for older adults: enlarged targets, clear feedback, predictable navigation, guided steps, and controlled motion.

## Tech Stack

**Core:**

- Framework: Next.js with Pages Router
- Runtime: Node.js 20+
- Language: TypeScript
- UI: React with Material UI
- State and persistence: Zustand for client state; Zustand `persist` for accessibility preferences
- Tests: Jest, React Testing Library, Playwright for critical user flows

**Key dependencies:**

- `next`
- `react`
- `@mui/material`
- `@emotion/react`
- `@emotion/styled`
- `zustand`
- `jest`
- `@testing-library/react`
- `@playwright/test`

## Scope

**v1 includes:**

- Personalization dashboard for font size, contrast, spacing, simplified/advanced mode, reinforced visual feedback, and critical-action confirmation.
- Simplified activity organizer with task list, guided steps, clear reminders, positive completion notices, and completed activity history.
- User profile and persistent settings for accessibility and notification preferences.
- Clean Architecture folder structure separating domain, application use cases, infrastructure adapters, and presentation modules.
- Material UI theme based on `DESIGN.md`, adapted for older-adult accessibility and WCAG-friendly contrast.
- CI workflow at `.github/workflows/ci.yml` with checkout, Node.js 20+ setup, install, lint, tests, and build.
- Microfrontend recommendation: keep `seniorease-web` as the Module Federation host and consume a future activity organizer remote.

**Explicitly out of scope:**

- Real authentication provider, account recovery, and role-based permissions.
- Cloud database, backend API, and multi-device synchronization.
- Native mobile apps.
- Calendar integrations such as Google Calendar or Outlook.
- AI assistant or automatic schedule generation.
- Production analytics and telemetry.

## Constraints

- Technical: Must use Next.js Pages Router, not App Router.
- Technical: Must use Node.js 20 or newer.
- Technical: Must follow Clean Architecture with domain isolated from UI and infrastructure.
- Technical: Must use Material UI and derive theme tokens from `DESIGN.md`.
- Technical: Must use Zustand for state management; accessibility preferences must use Zustand `persist`.
- Accessibility: Accessibility is a product requirement, validated through ARIA semantics, keyboard navigation, focus management, labels, and live-region feedback.
- Delivery: v1 should be demonstrable without a backend by using local client persistence.
