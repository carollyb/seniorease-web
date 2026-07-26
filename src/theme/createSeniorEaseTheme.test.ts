import { getContrastRatio, type Theme } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type UserPreferences,
} from '../domain/preferences'
import { createSeniorEaseTheme } from './createSeniorEaseTheme'
import { designTokens, mobileHighContrastTokens } from './designTokens'

function preferences(overrides: Partial<UserPreferences>): UserPreferences {
  return {
    ...createDefaultPreferences(),
    ...overrides,
  }
}

function getRootStyles(
  theme: Theme,
  componentName: keyof NonNullable<Theme['components']>,
): Record<string, unknown> {
  const component = theme.components?.[componentName]

  if (!component || typeof component === 'boolean') {
    return {}
  }

  return (
    (
      component as {
        styleOverrides?: { root?: Record<string, unknown> }
      }
    ).styleOverrides?.root ?? {}
  )
}

function getCssBaselineStyles(theme: Theme): Record<string, unknown> {
  return (theme.components?.MuiCssBaseline?.styleOverrides ??
    {}) as Record<string, unknown>
}

describe('createSeniorEaseTheme', () => {
  it('scales typography and control labels from the font preference', () => {
    const smallTheme = createSeniorEaseTheme(
      preferences({ fontScale: 'small' }),
    )
    const extraLargeTheme = createSeniorEaseTheme(
      preferences({ fontScale: 'extraLarge' }),
    )

    expect(smallTheme.typography.body1.fontSize).toBe('16px')
    expect(extraLargeTheme.typography.body1.fontSize).toBe('22px')
    expect(extraLargeTheme.typography.h2.fontSize).toBe('36px')
    expect(getRootStyles(extraLargeTheme, 'MuiButton').fontSize).toBe(
      '22px',
    )
  })

  it('updates the palette for each contrast preference', () => {
    const standardTheme = createSeniorEaseTheme(
      preferences({ contrastLevel: 'standard' }),
    )
    const highTheme = createSeniorEaseTheme(
      preferences({ contrastLevel: 'high' }),
    )
    const maximumTheme = createSeniorEaseTheme(
      preferences({ contrastLevel: 'maximum' }),
    )

    expect(standardTheme.palette.text.primary).toBe(
      designTokens.colorValues.ink,
    )
    expect(standardTheme.palette.background.default).toBe(
      designTokens.colorValues.surface,
    )
    expect(standardTheme.palette.background.paper).toBe(
      designTokens.colorValues.canvas,
    )
    expect(highTheme.palette.secondary.main).toBe(
      designTokens.colorValues.bluePressed,
    )
    expect(maximumTheme.palette.background.default).toBe(
      mobileHighContrastTokens.screenBackground,
    )
    expect(maximumTheme.palette.background.paper).toBe(
      mobileHighContrastTokens.cardBackground,
    )
    expect(maximumTheme.palette.text.primary).toBe(
      mobileHighContrastTokens.textPrimary,
    )
    expect(maximumTheme.palette.text.secondary).toBe(
      mobileHighContrastTokens.textSecondary,
    )
    expect(maximumTheme.palette.primary).toMatchObject({
      main: mobileHighContrastTokens.primaryButtonBackground,
      contrastText: mobileHighContrastTokens.primaryButtonText,
    })
    expect(maximumTheme.palette.divider).toBe(
      mobileHighContrastTokens.cardBorder,
    )
  })

  it('keeps Alto text, actions, disabled states, and semantic colors accessible', () => {
    const theme = createSeniorEaseTheme(
      preferences({ contrastLevel: 'maximum' }),
    )

    expect(
      getContrastRatio(
        theme.palette.text.primary,
        theme.palette.background.default,
      ),
    ).toBeGreaterThanOrEqual(7)
    expect(
      getContrastRatio(
        theme.palette.text.secondary,
        theme.palette.background.default,
      ),
    ).toBeGreaterThanOrEqual(7)
    expect(
      getContrastRatio(
        theme.palette.primary.contrastText,
        theme.palette.primary.main,
      ),
    ).toBeGreaterThanOrEqual(7)
    expect(
      getContrastRatio(
        theme.palette.warning.contrastText,
        theme.palette.warning.main,
      ),
    ).toBeGreaterThanOrEqual(7)
    expect(
      getContrastRatio(
        theme.palette.error.contrastText,
        theme.palette.error.main,
      ),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      getContrastRatio(
        mobileHighContrastTokens.disabledText,
        mobileHighContrastTokens.disabledBackground,
      ),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('centralizes Alto surfaces and interactive state colors in the theme', () => {
    const theme = createSeniorEaseTheme(
      preferences({ contrastLevel: 'maximum' }),
    )
    const cssBaselineStyles = getCssBaselineStyles(theme)
    const buttonStyles = getRootStyles(theme, 'MuiButton')
    const fieldStyles = getRootStyles(theme, 'MuiOutlinedInput')

    expect(cssBaselineStyles[':root']).toMatchObject({
      '--seniorease-canvas': mobileHighContrastTokens.cardBackground,
      '--seniorease-card-border': mobileHighContrastTokens.cardBorder,
      '--seniorease-selected-background':
        mobileHighContrastTokens.chipSelectedBackground,
      '--seniorease-selected-text':
        mobileHighContrastTokens.chipSelectedText,
      '--seniorease-focus': mobileHighContrastTokens.focus,
      '--seniorease-focus-halo': mobileHighContrastTokens.focusHalo,
    })
    expect(cssBaselineStyles['::selection']).toEqual({
      backgroundColor: mobileHighContrastTokens.chipSelectedBackground,
      color: mobileHighContrastTokens.chipSelectedText,
    })
    expect(buttonStyles['&.Mui-disabled']).toMatchObject({
      backgroundColor: designTokens.colors.disabledBackground,
      color: designTokens.colors.disabledText,
    })
    expect(buttonStyles['&.Mui-focusVisible']).toMatchObject({
      boxShadow: `0 0 0 6px ${designTokens.colors.focusHalo}`,
      outline: `3px solid ${designTokens.colors.focus}`,
    })
    expect(fieldStyles['&:hover .MuiOutlinedInput-notchedOutline'])
      .toMatchObject({
        borderColor: designTokens.colors.interactiveBorder,
        borderWidth: 2,
      })
    expect(fieldStyles['&.Mui-error .MuiOutlinedInput-notchedOutline'])
      .toMatchObject({
        borderColor: theme.palette.error.main,
        borderWidth: 2,
      })
  })

  it('expands spacing and accessible touch targets from the spacing preference', () => {
    const comfortableTheme = createSeniorEaseTheme(
      preferences({ spacingLevel: 'comfortable' }),
    )
    const extraWideTheme = createSeniorEaseTheme(
      preferences({ spacingLevel: 'extraWide' }),
    )

    expect(comfortableTheme.spacing(2)).toBe('16px')
    expect(extraWideTheme.spacing(2)).toBe('24px')
    expect(getRootStyles(comfortableTheme, 'MuiButton').minHeight).toBe(52)
    expect(getRootStyles(extraWideTheme, 'MuiButton').minHeight).toBe(64)
    expect(getRootStyles(extraWideTheme, 'MuiIconButton')).toMatchObject({
      height: 64,
      width: 64,
    })
  })

  it('defines visible focus states and ARIA-compatible state styling', () => {
    const theme = createSeniorEaseTheme(
      preferences({ contrastLevel: 'high' }),
    )

    expect(getRootStyles(theme, 'MuiButton')['&.Mui-focusVisible']).toEqual({
      boxShadow: `0 0 0 6px ${designTokens.colors.focusHalo}`,
      outline: `3px solid ${designTokens.colors.focus}`,
      outlineOffset: 3,
    })
    expect(getRootStyles(theme, 'MuiButton')['&[aria-current="page"]'])
      .toMatchObject({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      })
    expect(
      getRootStyles(theme, 'MuiOutlinedInput')[
        '&[aria-invalid="true"] .MuiOutlinedInput-notchedOutline'
      ],
    ).toMatchObject({
      borderColor: theme.palette.error.main,
      borderWidth: 2,
    })
  })

  it('reduces decorative complexity for simplified navigation mode', () => {
    const simplifiedTheme = createSeniorEaseTheme(
      preferences({ navigationMode: 'simplified' }),
    )
    const standardTheme = createSeniorEaseTheme(
      preferences({ navigationMode: 'standard' }),
    )

    expect(simplifiedTheme.components?.MuiCard?.defaultProps).toEqual({
      elevation: 0,
    })
    expect(getRootStyles(simplifiedTheme, 'MuiCard').boxShadow).toBe('none')
    expect(standardTheme.components?.MuiCard?.defaultProps).toEqual({
      elevation: 1,
    })
  })

  it('exposes repeated Figma values as reusable SeniorEase tokens', () => {
    expect(designTokens.components.appShell).toMatchObject({
      gapDesktop: 28,
      gapTablet: 22,
      gapMobile: 18,
      paddingDesktop: 32,
      paddingTablet: 28,
      paddingMobile: 18,
      radius: 32,
    })
    expect(designTokens.components.button).toMatchObject({
      minHeight: 52,
      paddingX: 20,
      paddingY: 14,
    })
    expect(designTokens.components.switch).toMatchObject({
      height: 36,
      thumbSize: 28,
      width: 64,
    })

    const theme = createSeniorEaseTheme()

    expect(theme.typography.fontFamily).toBe(designTokens.typography.fontFamily)
    expect(getRootStyles(theme, 'MuiCard').borderRadius).toBe(
      designTokens.rounded.xl,
    )
    expect(getRootStyles(theme, 'MuiChip')).toMatchObject({
      backgroundColor: designTokens.colors.yellowLight,
      borderRadius: designTokens.rounded.full,
      minHeight: 36,
    })
  })
})
