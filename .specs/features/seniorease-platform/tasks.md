# SeniorEase Platform Tasks

**Design**: `.specs/features/seniorease-platform/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Foundation

```text
T1 -> T2 -> T3 -> T4
```

### Phase 2: Core Modules

```text
T4 -> T5
T4 -> T6
T4 -> T7
T4 -> T8
```

### Phase 3: App Integration

```text
T5,T6,T7,T8 -> T9 -> T10 -> T11
```

### Phase 4: CI and Verification

```text
T11 -> T12 -> T13
```

### Phase 5: Figma Layout Alignment

```text
T6 -> F1
F1,T10 -> F2
F2,T7,T9,T10 -> F3
F2,T8,T10 -> F4
F3,F4 -> F5
```

---

## Task Breakdown

### T1: Scaffold Next.js 16 Pages Router Project

**What**: Create the project baseline with Next.js 16 Pages Router, TypeScript, Node.js 20+, Material UI, Zustand, testing dependencies, and npm scripts.
**Where**: `package.json`, `.nvmrc`, `tsconfig.json`, `next.config.js`, `src/pages/_app.tsx`
**Depends on**: None
**Reuses**: Project requirements from `.specs/project/PROJECT.md`
**Requirement**: SE-08, SE-10, SE-14, SE-16

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Next.js 16 Pages Router structure exists.
- [x] Node.js 20+ is documented in `.nvmrc`, `package.json` engines, and CI expectations.
- [x] TypeScript is configured.
- [x] Material UI, Emotion, and Zustand dependencies are declared.
- [x] Scripts exist for `lint`, `test`, `test:e2e`, and `build`.
- [x] Gate check passes: `npm run build`.

**Tests**: none
**Gate**: build

---

### T2: Create Clean Architecture Folders and Shared Types

**What**: Create base folders and shared type exports for domain, application, infrastructure, Zustand stores, presentation, pages, and theme.
**Where**: `src/domain`, `src/application`, `src/infrastructure`, `src/stores`, `src/presentation`, `src/theme`
**Depends on**: T1
**Reuses**: Folder structure from design.
**Requirement**: SE-08, SE-09

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Layer folders exist.
- [x] Domain folders have no UI imports.
- [x] Application ports folder exists.
- [x] Store folders exist outside domain and application layers.
- [x] Gate check passes: `npm run build`.

**Tests**: none
**Gate**: build

---

### T3: Implement Domain Models

**What**: Implement `UserPreferences`, `Activity`, validation helpers, default preferences, and activity state transitions.
**Where**: `src/domain/preferences`, `src/domain/activities`
**Depends on**: T2
**Reuses**: Data models from design.
**Requirement**: SE-01, SE-04, SE-06, SE-08

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Preference defaults are accessible and valid.
- [x] Activity creation and completion rules are implemented.
- [x] Domain files do not import React, Next.js, Material UI, Zustand, or browser APIs.
- [x] Unit tests cover defaults, validation, and completion transitions.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: unit
**Gate**: unit

---

### T4: Implement Use Cases and Repository Ports

**What**: Create use cases for validating/updating preferences and creating/listing/completing activities, backed by application ports where needed.
**Where**: `src/application`
**Depends on**: T3
**Reuses**: Domain models from T3.
**Requirement**: SE-04, SE-06, SE-08, SE-09

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Application ports are defined for preference state and activity repositories.
- [x] Use cases depend on ports or plain input/output contracts, not infrastructure, Zustand stores, or UI.
- [x] Unit tests mock repository ports.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: unit
**Gate**: unit

---

### T5: Implement Zustand Stores and Persistence [P]

**What**: Implement Zustand stores for accessibility preferences with `persist`, plus activity UI coordination state.
**Where**: `src/stores/preferences`, `src/stores/activities`
**Depends on**: T4
**Reuses**: Domain defaults, validation helpers, and use cases from T4.
**Requirement**: SE-06, SE-07, SE-09, SE-14

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Preference store uses Zustand `persist`.
- [x] Store hydration is handled safely for SSR/client rendering.
- [x] Invalid persisted preference data recovers to defaults.
- [x] Activity store coordinates use cases without embedding business rules.
- [x] Unit tests cover save, load, hydration, invalid data, and unavailable persistence.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: unit
**Gate**: unit

---

### T6: Implement Material UI Theme System [P]

**What**: Convert `DESIGN.md` tokens into a Material UI theme factory that responds to user preferences.
**Where**: `src/theme/designTokens.ts`, `src/theme/createSeniorEaseTheme.ts`
**Depends on**: T4
**Reuses**: Colors, typography, spacing, and component guidance from `DESIGN.md`.
**Requirement**: SE-01, SE-02, SE-03, SE-10, SE-11, SE-14, SE-15

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Theme supports font scale, contrast level, spacing level, and reduced complexity.
- [x] Buttons and controls use enlarged accessible touch targets.
- [x] Theme supports visible focus states and ARIA-compatible component states.
- [x] Unit tests verify theme changes for font, contrast, and spacing inputs.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: unit
**Gate**: unit

---

### T7: Implement Personalization Dashboard [P]

**What**: Create the dashboard UI controls for all experience preferences and immediate feedback.
**Where**: `src/presentation/personalization`
**Depends on**: T4
**Reuses**: Use cases and Material UI controls.
**Requirement**: SE-01, SE-02, SE-03, SE-11, SE-14, SE-15

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Controls exist for font size, contrast, spacing, navigation mode, reinforced feedback, and extra confirmation.
- [x] Changes update the Zustand preference store and remain validated by domain helpers.
- [x] Controls have accessible names, labels, and helper/error descriptions.
- [x] Reinforced feedback is visible and announced through a polite live region.
- [x] Component tests cover preference changes and feedback.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: integration
**Gate**: unit

---

### T8: Implement Activity Organizer [P]

**What**: Create task list, activity creation, guided steps, reminders, completion feedback, and completed history.
**Where**: `src/presentation/activities`
**Depends on**: T4
**Reuses**: Activity use cases and domain models.
**Requirement**: SE-04, SE-05, SE-11, SE-13, SE-15

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Empty state has one clear primary action.
- [x] Activity list shows title, reminder, status, and primary action with meaningful roles and accessible names.
- [x] Guided steps render in predictable order and are keyboard-operable.
- [x] Completing an activity shows positive feedback, announces it through a live region, and moves it to history.
- [x] Public contracts are ready for future extraction into an Activity Organizer Multi-Zone app.
- [x] Component tests cover create, guided step view, complete, and history.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: integration
**Gate**: unit

---

### T9: Implement Profile and Settings Pages

**What**: Create profile/configuration presentation that summarizes persisted settings and reminder preferences, aligned to the supplied desktop Figma frames.
**Where**: `src/presentation/profile`, `src/pages/perfil.tsx`, `src/pages/configuracoes.tsx`
**Depends on**: T5, T6, T7, T8
**Reuses**: Zustand preference store and theme system.
**Requirement**: SE-06, SE-07, SE-11, SE-14, SE-15, SE-17, SE-18

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] Profile page displays current preferences.
- [x] Settings page lets users update reminder preferences.
- [x] Profile desktop layout matches Figma node `703:200`.
- [x] Settings desktop layout matches Figma node `703:250`.
- [x] Saved settings are restored after reload.
- [x] Profile and settings controls expose accessible labels and descriptions.
- [x] Integration tests cover profile/settings render with saved preferences.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Verification note**: Figma MCP access succeeded through the duplicated NATGEO file `LJkhB7ZgDaJuxVi6CVP22Q` for nodes `703:200` and `703:250`.

**Tests**: integration
**Gate**: unit

---

### T10: Integrate Pages, Layout, Navigation, and Providers

**What**: Wire app providers, theme provider, predictable navigation, shared shell components, and pages for dashboard, activities, profile, and settings.
**Where**: `src/pages`, `src/presentation/shared`
**Depends on**: T9
**Reuses**: Presentation modules, Zustand stores, and activity infrastructure adapters.
**Requirement**: SE-01, SE-04, SE-06, SE-10, SE-11, SE-14, SE-15, SE-17, SE-18

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [x] `_app.tsx` loads providers, theme, and Zustand hydration handling.
- [x] `AppShell` composes shared page structure and main landmark behavior.
- [x] `SideNavigation` renders the Figma-aligned navigation pattern with active-route semantics.
- [x] `PrimaryButton`, `StatusPill`, and `EmptyState` centralize repeated visual treatments through MUI/theme tokens.
- [x] Main navigation supports simplified and standard modes.
- [x] Pages are reachable through predictable labels.
- [x] Critical actions honor extra confirmation.
- [x] Navigation uses semantic landmarks, accessible names, and stable focus order.
- [x] Gate check passes: `npm run build`.

**Tests**: integration
**Gate**: build

---

### T11: Add Accessibility E2E Coverage

**What**: Add Playwright tests for personalization, activity completion, Zustand preference persistence, ARIA premises, keyboard navigation, focus behavior, reduced motion, and Figma-driven responsive layouts.
**Where**: `tests/e2e`
**Depends on**: T10
**Reuses**: App pages from T10.
**Requirement**: SE-01, SE-04, SE-06, SE-11, SE-14, SE-15, SE-17, SE-18

**Tools**:

- MCP: filesystem
- Skill: browser

**Done when**:

- [x] E2E test changes font size and verifies visible application.
- [x] E2E test creates and completes an activity.
- [x] E2E test reloads and verifies Zustand-persisted preferences.
- [x] E2E test checks keyboard access to primary flows.
- [x] E2E test checks ARIA roles/names, labels, dialog focus behavior, and live-region feedback.
- [x] E2E or browser verification covers desktop/tablet/mobile dashboard and activities layouts against the linked Figma frames.
- [x] E2E or browser verification covers guided steps desktop/tablet layouts against the linked Figma frames.
- [x] Gate check passes: `npm run test:e2e`.

**Tests**: e2e
**Gate**: e2e

---

### T12: Add CI Workflow

**What**: Create GitHub Actions workflow for checkout, Node setup, npm install, lint, tests, and build.
**Where**: `.github/workflows/ci.yml`
**Depends on**: T11
**Reuses**: Provided CI requirements from user request.
**Requirement**: SE-12, SE-16

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [ ] Workflow runs on push to `main`.
- [ ] Workflow runs on pull request to `main`.
- [ ] Workflow uses `actions/checkout` and `actions/setup-node`.
- [ ] Workflow uses Node.js 20 or newer.
- [ ] Workflow runs `npm install`.
- [ ] Workflow runs `npm run lint || echo "Linting issues found"`.
- [ ] Workflow runs `npm test -- --watchAll=false`.
- [ ] Workflow runs `npm run build`.

**Tests**: none
**Gate**: build

---

### T13: Document Multi-Zone Activity Integration Plan

**What**: Document how `seniorease-web` acts as the primary Next.js zone, routes to a future Activity Organizer zone through Multi-Zones, and embeds remote activity subsections through Web Components.
**Where**: `docs/microfrontend-activity-zones.md`
**Depends on**: T12
**Reuses**: Activity organizer exports from T8 and design recommendation.
**Requirement**: SE-13

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [ ] Document names the SeniorEase primary zone and future Activity Organizer zone.
- [ ] Document explains route ownership for `/atividades` and nested activity paths.
- [ ] Document explains primary-zone `rewrites()` and activity-zone `assetPrefix`.
- [ ] Document lists shared contracts for preferences, theme tokens, data access, and accessibility guarantees.
- [ ] Document explains local fallback mode and zone-routed mode.
- [ ] Document identifies required future Next.js Multi-Zones configuration.
- [ ] Document explains Web Component usage for remote subsections inside primary-zone pages.
- [ ] Document includes examples for JavaScript properties, `data-mode="simplified"` attributes, and `CustomEvent` output.
- [ ] Gate check passes: `npm run build`.

**Tests**: none
**Gate**: build

---

## Figma Layout Revision Tasks

These tasks were added after the Figma screen layouts were supplied. They should be completed before treating the presentation layer as final, even if earlier foundation tasks remain marked complete.

### F1: Extract and Reconcile Figma Design Tokens

**What**: Inspect the supplied Figma frames and reconcile colors, typography, spacing, radii, elevation, and component states with `DESIGN.md` and the MUI theme token source.
**Where**: `DESIGN.md`, `src/theme/designTokens.ts`, `src/theme/createSeniorEaseTheme.ts`
**Depends on**: T6
**Reuses**: Figma frame links from `spec.md`, existing theme factory.
**Requirement**: SE-10, SE-11, SE-17, SE-18

**Done when**:

- [x] `DESIGN.md` reflects the SeniorEase Figma frames instead of unrelated or stale visual analysis.
- [x] Repeated Figma values are represented as theme tokens or component variants.
- [x] Theme tokens still respond to font size, contrast, spacing, and simplified-mode preferences.
- [x] Any intentional Figma/theme mismatch is documented with rationale.
- [x] Gate check passes: `npm test -- --watchAll=false src/theme`.

**Tests**: unit
**Gate**: unit

---

### F2: Build Shared Figma-Aligned Components

**What**: Create reusable MUI components required by the Figma layouts: `AppShell`, `SideNavigation`, `PrimaryButton`, `StatusPill`, and `EmptyState`.
**Where**: `src/presentation/shared/components`
**Depends on**: F1, T10
**Reuses**: MUI primitives, reconciled theme tokens, route metadata.
**Requirement**: SE-10, SE-11, SE-17, SE-18

**Done when**:

- [x] `AppShell` renders responsive landmarks, skip link, and page content slots.
- [x] `SideNavigation` supports active route, accessible names, keyboard focus, and responsive behavior from Figma.
- [x] `PrimaryButton`, `StatusPill`, and `EmptyState` centralize repeated visual treatments and avoid duplicated hardcoded values.
- [x] Component tests cover rendering, accessible names, active states, and disabled/focus states where applicable.
- [x] Gate check passes: `npm test -- --watchAll=false src/presentation/shared`.

**Tests**: integration
**Gate**: unit

---

### F3: Align Dashboard, Profile, and Settings Pages to Figma

**What**: Update dashboard, profile, and settings presentation to match the supplied Figma layouts and use the shared components from F2.
**Where**: `src/pages/index.tsx`, `src/pages/perfil.tsx`, `src/pages/configuracoes.tsx`, `src/presentation/personalization`, `src/presentation/profile`
**Depends on**: F2, T7, T9, T10
**Reuses**: `AppShell`, `SideNavigation`, `PrimaryButton`, `StatusPill`, `EmptyState`, preference store, theme tokens.
**Requirement**: SE-01, SE-06, SE-07, SE-10, SE-11, SE-14, SE-15, SE-17, SE-18

**Done when**:

- [x] Dashboard matches Figma nodes `703:5`, `703:305`, and `703:407` for desktop, tablet, and mobile.
- [x] Profile matches Figma node `703:200` for desktop and adapts responsively through shared shell rules.
- [x] Settings matches Figma node `703:250` for desktop and adapts responsively through shared shell rules.
- [x] Preference controls remain labeled, keyboard-operable, and connected to helper/status text.
- [x] Integration tests cover core dashboard/profile/settings interactions and responsive render assumptions.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Verification note**: Figma MCP inspection used duplicated NATGEO file `LJkhB7ZgDaJuxVi6CVP22Q` for nodes `703:5`, `703:305`, `703:407`, `703:200`, and `703:250`. Browser verification used a headless Playwright fallback because the in-app Browser Node runtime was blocked by the managed Windows sandbox; checked `/`, `/perfil`, and `/configuracoes` for visible headings/main landmarks and no horizontal overflow. `npm run test:e2e` passed after updating stale dashboard/shell selectors to the Figma-aligned copy.

**Tests**: integration
**Gate**: unit

---

### F4: Align Activities and Guided Steps Pages to Figma

**What**: Update activity list, activity cards, status pills, empty state, and guided step flow to match the supplied Figma layouts.
**Where**: `src/pages/atividades.tsx`, `src/presentation/activities`, `src/presentation/activities/components`
**Depends on**: F2, T8, T10
**Reuses**: `ActivityList`, `ActivityCard`, `StatusPill`, `PrimaryButton`, `EmptyState`, activity use cases and stores.
**Requirement**: SE-04, SE-05, SE-10, SE-11, SE-13, SE-15, SE-17, SE-18

**Done when**:

- [x] Activities page matches Figma nodes `703:78`, `703:361`, and `703:463` for desktop, tablet, and mobile.
- [x] Guided steps match Figma nodes `703:141` and `703:509` for desktop and tablet.
- [x] `ActivityList` and `ActivityCard` expose clear list semantics, accessible action names, reminder text, and status text.
- [x] Completing an activity announces polite live-region feedback and moves it to completed history.
- [x] Component tests cover empty state, card status, guided-step progress, keyboard operation, and completion feedback.
- [x] Gate check passes: `npm test -- --watchAll=false`.

**Verification note**: Figma MCP inspection used duplicated NATGEO file `LJkhB7ZgDaJuxVi6CVP22Q` for nodes `703:78`, `703:361`, `703:463`, `703:141`, and `703:509`. Activity components were extracted into `ActivityList` and `ActivityCard`, guided steps were reconciled with Figma progress/current-step/live-region patterns, and `npm test -- --watchAll=false` passed with 15 suites and 60 tests.

**Tests**: integration
**Gate**: unit

---

### F5: Run Responsive Visual and Accessibility Verification

**What**: Verify the Figma-aligned implementation across desktop, tablet, and mobile viewports with browser automation and accessibility checks.
**Where**: `tests/e2e`, local browser verification notes, Playwright screenshots if appropriate.
**Depends on**: F3, F4
**Reuses**: E2E setup from T11, testing matrix from `.specs/codebase/TESTING.md`.
**Requirement**: SE-01, SE-04, SE-06, SE-11, SE-15, SE-17, SE-18

**Done when**:

- [ ] Dashboard, activities, and guided-step viewports render nonblank and without horizontal overflow.
- [ ] Desktop/tablet/mobile screenshots are compared against the linked Figma frames during handoff.
- [ ] Largest font size and increased spacing do not clip or overlap controls.
- [ ] Keyboard-only navigation reaches all primary flows with visible focus.
- [ ] Completion feedback is announced through a polite live region.
- [ ] Gate checks pass: `npm run lint`, `npm test -- --watchAll=false`, `npm run build`, and `npm run test:e2e` when Playwright is available.

**Tests**: e2e
**Gate**: full

---

## Parallel Execution Map

```text
Phase 1:
  T1 -> T2 -> T3 -> T4

Phase 2:
  T4 complete, then:
    T5 [P]
    T6 [P]
    T7 [P]
    T8 [P]

Phase 3:
  T5,T6,T7,T8 -> T9 -> T10 -> T11

Phase 4:
  T11 -> T12 -> T13

Phase 5:
  T6 -> F1
  F1,T10 -> F2
  F2,T7,T9,T10 -> F3
  F2,T8,T10 -> F4
  F3,F4 -> F5
```

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| --- | --- | --- | --- |
| T1 | None | None | OK |
| T2 | T1 | T1 -> T2 | OK |
| T3 | T2 | T2 -> T3 | OK |
| T4 | T3 | T3 -> T4 | OK |
| T5 | T4 | T4 -> T5 | OK |
| T6 | T4 | T4 -> T6 | OK |
| T7 | T4 | T4 -> T7 | OK |
| T8 | T4 | T4 -> T8 | OK |
| T9 | T5, T6, T7, T8 | T5,T6,T7,T8 -> T9 | OK |
| T10 | T9 | T9 -> T10 | OK |
| T11 | T10 | T10 -> T11 | OK |
| T12 | T11 | T11 -> T12 | OK |
| T13 | T12 | T12 -> T13 | OK |
| F1 | T6 | T6 -> F1 | OK |
| F2 | F1, T10 | F1,T10 -> F2 | OK |
| F3 | F2, T7, T9, T10 | F2,T7,T9,T10 -> F3 | OK |
| F4 | F2, T8, T10 | F2,T8,T10 -> F4 | OK |
| F5 | F3, F4 | F3,F4 -> F5 | OK |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| --- | --- | --- | --- | --- |
| T1 | Project config | none | none | OK |
| T2 | Structure only | none | none | OK |
| T3 | Domain | unit | unit | OK |
| T4 | Application | unit | unit | OK |
| T5 | State Stores | unit | unit | OK |
| T6 | Theme | unit | unit | OK |
| T7 | Presentation components | unit/integration | integration | OK |
| T8 | Presentation components | unit/integration | integration | OK |
| T9 | Pages and routing | integration | integration | OK |
| T10 | Pages and routing | integration | integration | OK |
| T11 | Accessibility critical flows | e2e | e2e | OK |
| T12 | CI configuration | none | none | OK |
| T13 | Documentation | none | none | OK |
| F1 | Theme and design token source | unit | unit | OK |
| F2 | Shared presentation components | unit/integration | integration | OK |
| F3 | Pages and routing | integration | integration | OK |
| F4 | Presentation components | unit/integration | integration | OK |
| F5 | Accessibility critical flows and responsive visual checks | e2e | e2e | OK |
