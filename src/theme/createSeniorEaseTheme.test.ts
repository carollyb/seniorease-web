import type { Theme } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type UserPreferences,
} from '../domain/preferences'
import { createSeniorEaseTheme } from './createSeniorEaseTheme'
import { designTokens } from './designTokens'

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
  return (theme.components?.[componentName]?.styleOverrides?.root ??
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
    expect(extraLargeTheme.typography.h2.fontSize).toBe('50px')
    expect(getRootStyles(extraLargeTheme, 'MuiButton').fontSize).toBe(
      '19px',
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

    expect(standardTheme.palette.text.primary).toBe(designTokens.colors.ink)
    expect(highTheme.palette.secondary.main).toBe(
      designTokens.colors.bluePressed,
    )
    expect(maximumTheme.palette.background.default).toBe('#000000')
    expect(maximumTheme.palette.text.primary).toBe('#ffffff')
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
    expect(getRootStyles(comfortableTheme, 'MuiButton').minHeight).toBe(48)
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
      outline: `3px solid ${designTokens.colors.brandBlue}`,
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
})
