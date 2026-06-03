---
version: beta
name: SeniorEase-figma-token-analysis
description: SeniorEase is a calm accessibility-first task and preference app for older adults. The supplied Figma frames use a soft gray app canvas, high-contrast charcoal navigation, white cards, Inter typography, blue selected controls, yellow status and completion action accents, mint positive feedback, and generous rounded containers with large touch targets.
---

# SeniorEase Design Tokens

## Source Of Truth

The SeniorEase frames listed in `.specs/features/seniorease-platform/spec.md` are the current visual source of truth. The original Figma file key in the spec is not accessible in this session, so token extraction used the duplicated NATGEO file `LJkhB7ZgDaJuxVi6CVP22Q` with the same node IDs.

Inspected frames:

| Surface | Nodes |
| --- | --- |
| Dashboard | `703:5`, `703:305`, `703:407` |
| Activities | `703:78`, `703:361`, `703:463` |
| Guided steps | `703:141`, `703:509` |
| Profile | `703:200` |
| Settings | `703:250` |

## Overview

SeniorEase presents a stable workspace rather than a marketing surface. The app frame is a soft gray rounded canvas with a subtle border. Desktop uses a persistent charcoal side navigation; tablet and mobile collapse navigation into a charcoal top bar with a yellow menu pill. Main content is composed from white panels, soft-gray grouped panels, yellow status pills, black primary buttons, blue selected preference controls, and mint feedback regions.

The visual language prioritizes readability and confidence:

- Inter is the product font, with Noto Sans and system UI fallbacks.
- Page headings are large and steady at 36px with 1.4 line-height.
- Body and helper text use 18px, 17px, 16px, and 15px scales before user preference scaling.
- Primary action buttons use 52px minimum height, pill radius, and 16px semibold labels.
- Cards use 20px to 24px radii and flat borders instead of decorative shadow.
- Focus and selected states must remain visible after font, contrast, spacing, and simplified-mode preferences are applied.

## Colors

### Core

| Token | Value | Use |
| --- | --- | --- |
| `{colors.primary}` | `#1c1c1e` | Primary buttons, desktop side navigation, top bars |
| `{colors.on-primary}` | `#ffffff` | Text on charcoal surfaces |
| `{colors.charcoal}` | `#2c2c34` | Inactive side-navigation items and nav note panel |
| `{colors.canvas}` | `#ffffff` | Cards and primary content panels |
| `{colors.surface}` | `#f7f8fa` | App canvas and inactive preference pills |
| `{colors.surface-soft}` | `#fafbfc` | Activity-list grouping surface |
| `{colors.hairline}` | `#e0e2e8` | Card borders and standard dividers |
| `{colors.hairline-soft}` | `#eef0f3` | App frame border |
| `{colors.hairline-strong}` | `#c7cad5` | Secondary button borders |

### Text

| Token | Value | Use |
| --- | --- | --- |
| `{colors.ink-deep}` | `#050038` | Page headings |
| `{colors.ink}` | `#1c1c1e` | Primary text |
| `{colors.slate}` | `#555a6a` | Descriptions and secondary text |
| `{colors.steel}` | `#6b6f7e` | Disabled text and tertiary text |
| `{colors.muted}` | `#a5a8b5` | Inactive nav dots and muted controls |

### Accent And Semantic

| Token | Value | Use |
| --- | --- | --- |
| `{colors.brand-blue}` | `#4262ff` | Selected preference controls and focus ring in standard/high contrast |
| `{colors.blue-pressed}` | `#2a41b6` | High-contrast secondary action color and pressed blue state |
| `{colors.brand-yellow}` | `#ffd02f` | Menu pill and complete-activity action |
| `{colors.yellow-light}` | `#fff4c4` | Active navigation item and status pills |
| `{colors.yellow-soft}` | `#fff8e0` | Current guided-step background |
| `{colors.yellow-border}` | `#fcb900` | Current guided-step border |
| `{colors.brand-teal}` | `#0fbcb0` | Logo accent |
| `{colors.teal-light}` | `#c3faf5` | Positive feedback/live-region background |
| `{colors.success-accent}` | `#00b473` | Switch-on state and success indicator |
| `{colors.brand-red}` | `#fbd4d4` | Critical-action confirmation panel |
| `{colors.coral-dark}` | `#600000` | High-contrast error foreground/background mapping |

## Typography

### Font Family

`Inter` is the Figma font family. The runtime theme should use `"Inter", "Noto Sans", system-ui, sans-serif`.

### Scale

| Token | Size | Weight | Line Height | Use |
| --- | --- | --- | --- | --- |
| `{typography.h1}` | 36px | 600 | 1.4 | Page headings |
| `{typography.h2}` | 26px | 600 | 1.4 | Guided activity title |
| `{typography.h3}` | 24px | 600 | 1.4 | Feedback and empty-state titles |
| `{typography.h4}` | 22px | 600 | 1.4 | Brand text and section card titles |
| `{typography.h5}` | 18px | 600 | 1.4 | Control/card titles |
| `{typography.subtitle}` | 18px | 400 | 1.4 | Page supporting text |
| `{typography.body}` | 16px | 400 | 1.4 | Standard body text |
| `{typography.body-small}` | 15px | 400 | 1.4 | Activity reminder text |
| `{typography.caption}` | 14px | 500 | 1.4 | Pills, status labels, menu label |
| `{typography.button}` | 16px | 600 | 1.4 | Primary and secondary button labels |
| `{typography.mobile-activity-title}` | 14px | 600 | 1.4 | Mobile activity cards |
| `{typography.mobile-activity-meta}` | 11px | 400 | 1.4 | Mobile reminder text and compact status |

All theme typography variants keep `letterSpacing: 0`. User font-scale preferences multiply headings, body, inputs, buttons, and helper text.

## Layout And Spacing

SeniorEase uses a 4px foundation with Figma-specific intermediate values promoted to tokens.

| Token | Value | Use |
| --- | --- | --- |
| `{spacing.xxs}` | 4px | Tiny offsets |
| `{spacing.xs}` | 8px | Compact pill padding |
| `{spacing.sm}` | 12px | Nav item gap and compact padding |
| `{spacing.md}` | 16px | Card gaps and horizontal pill padding |
| `{spacing.row-padding}` | 18px | Desktop/tablet activity row padding |
| `{spacing.lg}` | 20px | Button horizontal padding and guided-step padding |
| `{spacing.mobile-page}` | 18px | Mobile app-frame padding and gap |
| `{spacing.tablet-page}` | 28px | Tablet app-frame padding |
| `{spacing.xl}` | 24px | Standard card padding and section gap |
| `{spacing.app-frame}` | 32px | Desktop app-frame padding |
| `{spacing.xxxl}` | 40px | Large derived spacing reserve |

Responsive shell values:

| Viewport | App Padding | Main Gap | Navigation |
| --- | --- | --- | --- |
| Desktop | 32px | 28px | Side navigation |
| Tablet | 28px | 22px | Top navigation |
| Mobile | 18px | 18px | Top navigation |

## Radius

| Token | Value | Use |
| --- | --- | --- |
| `{rounded.xs}` | 4px | Fine details |
| `{rounded.sm}` | 8px | Small controls |
| `{rounded.md}` | 16px | Navigation items and inputs |
| `{rounded.lg}` | 20px | Activity rows and mobile top bar |
| `{rounded.xl}` | 24px | Cards, grouped panels, tablet top bar |
| `{rounded.xxl}` | 28px | Desktop side navigation |
| `{rounded.feature}` | 32px | Outer app frame |
| `{rounded.full}` | 9999px | Buttons, pills, switches, dots |

## Elevation And Borders

The Figma frames are mostly flat. Use borders as the primary separation device:

- App frame: `1px solid {colors.hairline-soft}`
- Cards and grouped panels: `1px solid {colors.hairline}`
- Secondary button: `1px solid {colors.hairline-strong}`
- Current guided step: `1px solid {colors.yellow-border}`

Intentional theme mismatch: standard-mode MUI cards may keep a very subtle framework elevation for existing Material UI behavior, but simplified mode must remove decorative elevation. Figma-aligned shared components should use flat borders unless a later frame introduces a shadow.

## Components

### App Shell

- Desktop app frame: `{colors.surface}`, `{rounded.feature}`, 32px padding, 28px gap, hairline-soft border.
- Tablet app frame: 28px padding, 22px gap, same 32px radius.
- Mobile app frame: 18px padding, 18px gap, same 32px radius.
- Main content stacks with 24px section gaps.

### Navigation

Desktop side navigation:

- Background `{colors.primary}`, text `{colors.on-primary}`.
- Radius 28px, horizontal padding 20px, vertical padding 28px, internal gap 24px.
- Logo mark is 44px square with yellow, blue, and teal shapes.
- Active nav item: `{colors.yellow-light}` background, `{colors.ink}` text, 16px radius, 16px x 12px padding.
- Inactive nav item: `{colors.charcoal}` background, white text, 16px radius.
- Nav note panel: `{colors.charcoal}`, 24px radius, 24px padding, 15px text.

Tablet/mobile top navigation:

- Background `{colors.primary}`, white brand text.
- Tablet: 20px x 16px padding, 24px radius, 26px brand text.
- Mobile: 12px x 10px padding, 20px radius, 21px brand text.
- Menu pill: `{colors.brand-yellow}` background, 14px x 8px padding, full radius, 14px medium text.

### Buttons

Primary button:

- Background `{colors.primary}`, text `{colors.on-primary}`.
- Minimum height 52px, padding 14px x 20px, full radius.
- Typography: 16px, 600, 1.4.

Secondary button:

- Background `{colors.canvas}`, text `{colors.ink}`.
- Border `{colors.hairline-strong}`, minimum height 52px, same padding and radius.

Completion button:

- Background `{colors.brand-yellow}`, text `{colors.ink}`.
- Same size and typography as primary button.

### Cards And Panels

Standard card:

- Background `{colors.canvas}`, border `{colors.hairline}`, radius 24px, padding 24px, 16px internal gap.

Activity list panel:

- Background `{colors.surface-soft}`, border `{colors.hairline}`, radius 24px.
- Desktop/tablet padding 24px, 16px gap.
- Mobile padding 16px, 12px gap.

Activity row:

- Desktop/tablet: white, hairline border, 20px radius, 18px padding, 96px target height.
- Mobile: white, hairline border, 20px radius, 14px padding, vertical layout.

Guided step:

- Default: white, hairline border, 22px radius, 20px padding, 18px gap.
- Current step: `{colors.yellow-soft}` background with `{colors.yellow-border}` border.
- Step icon: 40px circle.

Feedback panel:

- Positive: `{colors.teal-light}` background, hairline border, 24px radius, 24px padding.
- Critical: `{colors.brand-red}` background, hairline border, 24px radius, 24px padding.

### Pills And Status

Status pill:

- Background `{colors.yellow-light}`, text `{colors.ink}`.
- Full radius, 16px x 9px padding on desktop/tablet, 12px x 8px on mobile activity cards.
- Typography: 14px medium on desktop/tablet, 11px medium on compact mobile rows.

Preference pill:

- Inactive background `{colors.surface}`, active background `{colors.brand-blue}`.
- Full radius.
- Normal label 14px medium, selected large font-size pill may use 20px text and 18px x 12px padding.

Switch:

- Track size 64px x 36px.
- On background `{colors.success-accent}`.
- Thumb 28px, 4px inset.

## Accessibility

- Prefer semantic HTML and native controls before ARIA.
- Every interactive control requires an accessible name.
- Status and progress text must be present in copy, not only color.
- Positive completion feedback uses polite live regions.
- Critical confirmations need clear text and focus management when implemented as dialogs.
- All controls keep visible focus rings with at least 3px outline and sufficient contrast.
- Largest font scale and widest spacing must preserve wrapping without horizontal overflow.

## Token Implementation Notes

- `src/theme/designTokens.ts` stores the extracted constants.
- `src/theme/createSeniorEaseTheme.ts` maps those tokens into Material UI palette, typography, spacing, shape, and component overrides.
- Figma values should be consumed through theme tokens or shared components in later layout tasks. Page-local color and size literals are acceptable only when a new frame-specific value has not repeated yet.
