# Testing Strategy

**Project Type:** Greenfield Next.js 16 Pages Router application
**Status:** Planned

## Test Coverage Matrix

| Layer | Examples | Required Test Type | Parallel-Safe |
| --- | --- | --- | --- |
| Domain | Entities, value objects, business rules | unit | Yes |
| Application | Use cases, DTO mapping, repository orchestration | unit | Yes |
| Infrastructure | Activity repositories, storage mappers, Zustand persistence boundaries | unit | Yes |
| State Stores | Zustand stores, selectors, persisted preference state | unit | Yes |
| Presentation Components | React components, Material UI composition | unit/integration | Yes |
| Pages and Routing | Next pages, layout composition | integration | Yes |
| Accessibility Critical Flows | personalization, guided tasks, profile settings, ARIA roles/names, keyboard navigation, focus management | e2e | No |
| Responsive Figma Layouts | dashboard, activities, guided steps, profile, settings across supplied desktop/tablet/mobile frames | e2e/browser verification | No |
| CI Configuration | GitHub Actions workflow | none | Yes |

## Gate Check Commands

| Gate | Command | Expected Result |
| --- | --- | --- |
| lint | `npm run lint` | No lint errors |
| unit | `npm test -- --watchAll=false` | Unit and integration tests pass |
| e2e | `npm run test:e2e` | Critical browser flows pass |
| build | `npm run build` | Production build completes |
| full | `npm run lint && npm test -- --watchAll=false && npm run build` | Lint, tests, and build pass |

## Package Scripts Required

```json
{
  "lint": "next lint",
  "test": "jest",
  "test:e2e": "playwright test",
  "build": "next build"
}
```

## Notes

- Tests must be co-located with the task that creates or changes the tested layer.
- E2E tests are sequential because they exercise shared browser state and persisted preferences.
- Accessibility validation must check ARIA premises: semantic roles, accessible names, labels, focus order, keyboard operability, dialog semantics, and live-region announcements for feedback.
- Figma layout validation must compare local desktop/tablet/mobile renderings against the linked frames and check for nonblank rendering, horizontal overflow, clipped text, overlapping controls, and visible focus states.
- CI may omit `test:e2e` in the first pipeline if Playwright browsers are not installed in the runner, but the test script should exist for local validation.
