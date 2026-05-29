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

---

## Task Breakdown

### T1: Scaffold Next.js Pages Router Project

**What**: Create the project baseline with Next.js Pages Router, TypeScript, Node.js 20+, Material UI, Zustand, testing dependencies, and npm scripts.
**Where**: `package.json`, `.nvmrc`, `tsconfig.json`, `next.config.js`, `src/pages/_app.tsx`
**Depends on**: None
**Reuses**: Project requirements from `.specs/project/PROJECT.md`
**Requirement**: SE-08, SE-10, SE-14, SE-16

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [ ] Next.js Pages Router structure exists.
- [ ] Node.js 20+ is documented in `.nvmrc`, `package.json` engines, and CI expectations.
- [ ] TypeScript is configured.
- [ ] Material UI, Emotion, and Zustand dependencies are declared.
- [ ] Scripts exist for `lint`, `test`, `test:e2e`, and `build`.
- [ ] Gate check passes: `npm run build`.

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

- [ ] Layer folders exist.
- [ ] Domain folders have no UI imports.
- [ ] Application ports folder exists.
- [ ] Store folders exist outside domain and application layers.
- [ ] Gate check passes: `npm run build`.

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

- [ ] Preference defaults are accessible and valid.
- [ ] Activity creation and completion rules are implemented.
- [ ] Domain files do not import React, Next.js, Material UI, Zustand, or browser APIs.
- [ ] Unit tests cover defaults, validation, and completion transitions.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

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

- [ ] Application ports are defined for preference state and activity repositories.
- [ ] Use cases depend on ports or plain input/output contracts, not infrastructure, Zustand stores, or UI.
- [ ] Unit tests mock repository ports.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

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

- [ ] Preference store uses Zustand `persist`.
- [ ] Store hydration is handled safely for SSR/client rendering.
- [ ] Invalid persisted preference data recovers to defaults.
- [ ] Activity store coordinates use cases without embedding business rules.
- [ ] Unit tests cover save, load, hydration, invalid data, and unavailable persistence.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

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

- [ ] Theme supports font scale, contrast level, spacing level, and reduced complexity.
- [ ] Buttons and controls use enlarged accessible touch targets.
- [ ] Theme supports visible focus states and ARIA-compatible component states.
- [ ] Unit tests verify theme changes for font, contrast, and spacing inputs.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

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

- [ ] Controls exist for font size, contrast, spacing, navigation mode, reinforced feedback, and extra confirmation.
- [ ] Changes update the Zustand preference store and remain validated by domain helpers.
- [ ] Controls have accessible names, labels, and helper/error descriptions.
- [ ] Reinforced feedback is visible and announced through a polite live region.
- [ ] Component tests cover preference changes and feedback.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

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

- [ ] Empty state has one clear primary action.
- [ ] Activity list shows title, reminder, status, and primary action with meaningful roles and accessible names.
- [ ] Guided steps render in predictable order and are keyboard-operable.
- [ ] Completing an activity shows positive feedback, announces it through a live region, and moves it to history.
- [ ] Public contracts are ready for future remote consumption by the SeniorEase host.
- [ ] Component tests cover create, guided step view, complete, and history.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: integration
**Gate**: unit

---

### T9: Implement Profile and Settings Pages

**What**: Create profile/configuration presentation that summarizes persisted settings and reminder preferences.
**Where**: `src/presentation/profile`, `src/pages/perfil.tsx`, `src/pages/configuracoes.tsx`
**Depends on**: T5, T6, T7, T8
**Reuses**: Zustand preference store and theme system.
**Requirement**: SE-06, SE-07, SE-11, SE-14, SE-15

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [ ] Profile page displays current preferences.
- [ ] Settings page lets users update reminder preferences.
- [ ] Saved settings are restored after reload.
- [ ] Profile and settings controls expose accessible labels and descriptions.
- [ ] Integration tests cover profile/settings render with saved preferences.
- [ ] Gate check passes: `npm test -- --watchAll=false`.

**Tests**: integration
**Gate**: unit

---

### T10: Integrate Pages, Layout, Navigation, and Providers

**What**: Wire app providers, theme provider, predictable navigation, and pages for dashboard, activities, profile, and settings.
**Where**: `src/pages`, `src/presentation/shared`
**Depends on**: T9
**Reuses**: Presentation modules, Zustand stores, and activity infrastructure adapters.
**Requirement**: SE-01, SE-04, SE-06, SE-10, SE-11, SE-14, SE-15

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [ ] `_app.tsx` loads providers, theme, and Zustand hydration handling.
- [ ] Main navigation supports simplified and standard modes.
- [ ] Pages are reachable through predictable labels.
- [ ] Critical actions honor extra confirmation.
- [ ] Navigation uses semantic landmarks, accessible names, and stable focus order.
- [ ] Gate check passes: `npm run build`.

**Tests**: integration
**Gate**: build

---

### T11: Add Accessibility E2E Coverage

**What**: Add Playwright tests for personalization, activity completion, Zustand preference persistence, ARIA premises, keyboard navigation, focus behavior, and reduced motion.
**Where**: `tests/e2e`
**Depends on**: T10
**Reuses**: App pages from T10.
**Requirement**: SE-01, SE-04, SE-06, SE-11, SE-14, SE-15

**Tools**:

- MCP: filesystem
- Skill: browser

**Done when**:

- [ ] E2E test changes font size and verifies visible application.
- [ ] E2E test creates and completes an activity.
- [ ] E2E test reloads and verifies Zustand-persisted preferences.
- [ ] E2E test checks keyboard access to primary flows.
- [ ] E2E test checks ARIA roles/names, labels, dialog focus behavior, and live-region feedback.
- [ ] Gate check passes: `npm run test:e2e`.

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

### T13: Document Module Federation Host Plan

**What**: Document how `seniorease-web` acts as the Module Federation host and consumes a future activity organizer remote.
**Where**: `docs/microfrontend-activity-host.md`
**Depends on**: T12
**Reuses**: Activity organizer exports from T8 and design recommendation.
**Requirement**: SE-13

**Tools**:

- MCP: filesystem
- Skill: NONE

**Done when**:

- [ ] Document names the SeniorEase host, remote app, and exposed module.
- [ ] Document explains the host remote mapping.
- [ ] Document lists shared dependencies.
- [ ] Document explains local fallback mode and remote consumption mode.
- [ ] Document identifies required future Next.js Module Federation configuration.
- [ ] Gate check passes: `npm run build`.

**Tests**: none
**Gate**: build

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
