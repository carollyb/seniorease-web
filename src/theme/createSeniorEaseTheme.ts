import { createTheme, type ThemeOptions } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type ContrastLevel,
  type FontScale,
  type NavigationMode,
  type SpacingLevel,
  type UserPreferences,
} from '../domain/preferences'
import { designTokens } from './designTokens'

type SeniorEasePalette = NonNullable<ThemeOptions['palette']> & {
  background: {
    default: string
    paper: string
  }
  divider: string
  error: {
    main: string
    contrastText: string
  }
  primary: {
    main: string
    contrastText: string
  }
  secondary: {
    main: string
    contrastText: string
  }
  success: {
    main: string
    contrastText: string
  }
  text: {
    primary: string
    secondary: string
  }
  warning: {
    main: string
    contrastText: string
  }
}

const fontScaleMultipliers: Record<FontScale, number> = {
  small: 1,
  medium: 1.125,
  large: 1.25,
  extraLarge: 1.375,
}

const spacingBaseByLevel: Record<SpacingLevel, number> = {
  comfortable: 8,
  wide: 10,
  extraWide: 12,
}

const touchTargetBySpacing: Record<SpacingLevel, number> = {
  comfortable: 48,
  wide: 56,
  extraWide: 64,
}

function toScaledPx(baseSize: number, fontScale: FontScale): string {
  return `${Math.round(baseSize * fontScaleMultipliers[fontScale])}px`
}

function createTypographyOptions(
  fontScale: FontScale,
): ThemeOptions['typography'] {
  const { typography } = designTokens

  return {
    fontFamily: typography.fontFamily,
    htmlFontSize: 16,
    h1: {
      fontSize: toScaledPx(typography.h1.fontSize, fontScale),
      fontWeight: typography.h1.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.h1.lineHeight,
    },
    h2: {
      fontSize: toScaledPx(typography.h2.fontSize, fontScale),
      fontWeight: typography.h2.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.h2.lineHeight,
    },
    h3: {
      fontSize: toScaledPx(typography.h3.fontSize, fontScale),
      fontWeight: typography.h3.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.h3.lineHeight,
    },
    h4: {
      fontSize: toScaledPx(typography.h4.fontSize, fontScale),
      fontWeight: typography.h4.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.h4.lineHeight,
    },
    h5: {
      fontSize: toScaledPx(typography.h5.fontSize, fontScale),
      fontWeight: typography.h5.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.h5.lineHeight,
    },
    h6: {
      fontSize: toScaledPx(typography.subtitle.fontSize, fontScale),
      fontWeight: typography.h5.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.subtitle.lineHeight,
    },
    subtitle1: {
      fontSize: toScaledPx(typography.subtitle.fontSize, fontScale),
      fontWeight: typography.subtitle.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.subtitle.lineHeight,
    },
    body1: {
      fontSize: toScaledPx(typography.body.fontSize, fontScale),
      fontWeight: typography.body.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.body.lineHeight,
    },
    body2: {
      fontSize: toScaledPx(typography.bodySmall.fontSize, fontScale),
      fontWeight: typography.bodySmall.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.bodySmall.lineHeight,
    },
    button: {
      fontSize: toScaledPx(typography.button.fontSize, fontScale),
      fontWeight: typography.button.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.button.lineHeight,
      textTransform: 'none',
    },
    caption: {
      fontSize: toScaledPx(typography.caption.fontSize, fontScale),
      fontWeight: typography.caption.fontWeight,
      letterSpacing: 0,
      lineHeight: typography.caption.lineHeight,
    },
  }
}

function createPaletteOptions(contrastLevel: ContrastLevel): SeniorEasePalette {
  const { colors } = designTokens

  if (contrastLevel === 'maximum') {
    return {
      mode: 'dark',
      primary: {
        main: '#ffffff',
        contrastText: '#000000',
      },
      secondary: {
        main: colors.brandYellow,
        contrastText: '#000000',
      },
      success: {
        main: '#00e091',
        contrastText: '#000000',
      },
      error: {
        main: '#ffb4b4',
        contrastText: '#000000',
      },
      warning: {
        main: colors.brandYellow,
        contrastText: '#000000',
      },
      background: {
        default: '#000000',
        paper: '#000000',
      },
      divider: '#ffffff',
      text: {
        primary: '#ffffff',
        secondary: '#f7f8fa',
      },
    }
  }

  if (contrastLevel === 'high') {
    return {
      mode: 'light',
      primary: {
        main: colors.inkDeep,
        contrastText: colors.onPrimary,
      },
      secondary: {
        main: colors.bluePressed,
        contrastText: colors.onPrimary,
      },
      success: {
        main: colors.successAccent,
        contrastText: colors.onPrimary,
      },
      error: {
        main: colors.coralDark,
        contrastText: colors.onPrimary,
      },
      warning: {
        main: colors.yellowDark,
        contrastText: colors.onPrimary,
      },
      background: {
        default: colors.canvas,
        paper: colors.canvas,
      },
      divider: colors.hairlineStrong,
      text: {
        primary: colors.inkDeep,
        secondary: colors.charcoal,
      },
    }
  }

  return {
    mode: 'light',
    primary: {
      main: colors.primary,
      contrastText: colors.onPrimary,
    },
    secondary: {
      main: colors.brandBlue,
      contrastText: colors.onPrimary,
    },
    success: {
      main: colors.successAccent,
      contrastText: colors.onPrimary,
    },
    error: {
      main: colors.coralDark,
      contrastText: colors.onPrimary,
    },
    warning: {
      main: colors.brandYellow,
      contrastText: colors.primary,
    },
    background: {
      default: colors.canvas,
      paper: colors.surface,
    },
    divider: colors.hairline,
    text: {
      primary: colors.ink,
      secondary: colors.slate,
    },
  }
}

function createComponentOptions(
  preferences: UserPreferences,
  palette: SeniorEasePalette,
): ThemeOptions['components'] {
  const { colors, rounded, spacing } = designTokens
  const touchTarget = touchTargetBySpacing[preferences.spacingLevel]
  const spacingBase = spacingBaseByLevel[preferences.spacingLevel]
  const focusColor =
    preferences.contrastLevel === 'maximum'
      ? colors.brandYellow
      : colors.brandBlue
  const focusStyles = {
    outline: `3px solid ${focusColor}`,
    outlineOffset: 3,
  }
  const buttonPadding = `${Math.max(spacing.sm, spacingBase + 4)}px ${Math.max(
    spacing.xl,
    spacingBase * 3,
  )}px`
  const fieldPadding = `${Math.max(spacing.sm, spacingBase)}px ${Math.max(
    spacing.md,
    spacingBase * 2,
  )}px`
  const isSimplified = preferences.navigationMode === 'simplified'
  const selectedState = {
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
  }

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
          color: palette.text.primary,
        },
        ':focus-visible': focusStyles,
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            scrollBehavior: 'auto !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        root: {
          borderRadius: rounded.full,
          boxShadow: isSimplified ? 'none' : undefined,
          fontSize: toScaledPx(
            designTokens.typography.button.fontSize,
            preferences.fontScale,
          ),
          fontWeight: designTokens.typography.button.fontWeight,
          letterSpacing: 0,
          lineHeight: designTokens.typography.button.lineHeight,
          minHeight: touchTarget,
          minWidth: touchTarget,
          padding: buttonPadding,
          textTransform: 'none',
          '&.Mui-disabled': {
            backgroundColor: colors.hairline,
            color: colors.steel,
          },
          '&.Mui-focusVisible': focusStyles,
          '&[aria-current="page"]': selectedState,
          '&[aria-pressed="true"]': {
            ...selectedState,
            boxShadow: `inset 0 0 0 2px ${focusColor}`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: rounded.full,
          height: touchTarget,
          width: touchTarget,
          '&.Mui-focusVisible': focusStyles,
          '&[aria-pressed="true"]': selectedState,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: toScaledPx(
            designTokens.typography.body.fontSize,
            preferences.fontScale,
          ),
          lineHeight: designTokens.typography.body.lineHeight,
          minHeight: touchTarget,
        },
        input: {
          padding: fieldPadding,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: rounded.md,
          minHeight: touchTarget,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: focusColor,
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.error.main,
            borderWidth: 2,
          },
          '&[aria-invalid="true"] .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.error.main,
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: palette.divider,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: toScaledPx(
            designTokens.typography.caption.fontSize,
            preferences.fontScale,
          ),
          lineHeight: designTokens.typography.caption.lineHeight,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: touchTarget,
          '&.Mui-focusVisible': focusStyles,
          '&[aria-selected="true"]': selectedState,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: touchTarget,
          '&.Mui-focusVisible': focusStyles,
          '&[aria-current="page"]': selectedState,
          '&[aria-selected="true"]': selectedState,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: rounded.full,
          minHeight: touchTarget,
          minWidth: touchTarget,
          textTransform: 'none',
          '&.Mui-focusVisible': focusStyles,
          '&[aria-selected="true"]': selectedState,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          minHeight: touchTarget,
          minWidth: touchTarget,
        },
        switchBase: {
          '&.Mui-focusVisible + .MuiSwitch-track': {
            outline: `3px solid ${focusColor}`,
            outlineOffset: 3,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: isSimplified ? 0 : 1,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${palette.divider}`,
          borderRadius: rounded.md,
          boxShadow: isSimplified ? 'none' : undefined,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: isSimplified ? 0 : 1,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: rounded.md,
          fontSize: toScaledPx(
            designTokens.typography.body.fontSize,
            preferences.fontScale,
          ),
          minHeight: touchTarget,
        },
      },
    },
  }
}

export function createSeniorEaseTheme(
  preferences: UserPreferences = createDefaultPreferences(),
) {
  const palette = createPaletteOptions(preferences.contrastLevel)

  return createTheme({
    palette,
    spacing: spacingBaseByLevel[preferences.spacingLevel],
    typography: createTypographyOptions(preferences.fontScale),
    shape: {
      borderRadius: designTokens.rounded.md,
    },
    components: createComponentOptions(preferences, palette),
  })
}
