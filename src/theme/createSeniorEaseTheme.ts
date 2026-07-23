import { createTheme, type ThemeOptions } from '@mui/material/styles'

import {
  createDefaultPreferences,
  type ContrastLevel,
  type FontScale,
  type NavigationMode,
  type SpacingLevel,
  type UserPreferences,
} from '../domain/preferences'
import {
  designTokens,
  mobileHighContrastTokens,
  seniorEaseColorValues,
  seniorEaseColorVariableNames,
  type SeniorEaseResolvedColors,
} from './designTokens'

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
  info: {
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
  comfortable: designTokens.components.button.minHeight,
  wide: 56,
  extraWide: 64,
}

const standardResolvedColors: SeniorEaseResolvedColors = {
  ...seniorEaseColorValues,
  focus: seniorEaseColorValues.brandBlue,
  focusHalo: 'transparent',
  interactiveBorder: seniorEaseColorValues.inkDeep,
  disabledBackground: seniorEaseColorValues.hairline,
  disabledText: seniorEaseColorValues.steel,
  primaryHover: seniorEaseColorValues.charcoal,
  secondaryHover: seniorEaseColorValues.surface,
  completionHover: seniorEaseColorValues.yellowBorder,
}

const maximumResolvedColors: SeniorEaseResolvedColors = {
  primary: mobileHighContrastTokens.primaryButtonBackground,
  onPrimary: mobileHighContrastTokens.primaryButtonText,
  canvas: mobileHighContrastTokens.cardBackground,
  surface: mobileHighContrastTokens.screenBackground,
  surfaceSoft: mobileHighContrastTokens.cardBackground,
  hairline: mobileHighContrastTokens.cardBorder,
  hairlineSoft: mobileHighContrastTokens.cardBorder,
  hairlineStrong: mobileHighContrastTokens.cardBorder,
  inkDeep: mobileHighContrastTokens.textPrimary,
  ink: mobileHighContrastTokens.textPrimary,
  charcoal: mobileHighContrastTokens.primaryHover,
  slate: mobileHighContrastTokens.textSecondary,
  steel: mobileHighContrastTokens.disabledText,
  muted: mobileHighContrastTokens.primaryButtonText,
  brandBlue: mobileHighContrastTokens.chipSelectedBackground,
  blue450: mobileHighContrastTokens.primaryHover,
  bluePressed: mobileHighContrastTokens.chipSelectedBackground,
  brandYellow: mobileHighContrastTokens.topBarActionBackground,
  yellowLight: mobileHighContrastTokens.warningSurface,
  yellowSoft: mobileHighContrastTokens.warningSurface,
  yellowBorder: mobileHighContrastTokens.cardBorder,
  yellowDark: mobileHighContrastTokens.warningText,
  brandTeal: mobileHighContrastTokens.successBorder,
  tealLight: mobileHighContrastTokens.successSurface,
  mossDark: mobileHighContrastTokens.textPrimary,
  brandRed: mobileHighContrastTokens.dangerSurface,
  brandRedDark: '#FFD0CC',
  coralDark: mobileHighContrastTokens.dangerText,
  successAccent: mobileHighContrastTokens.successBorder,
  focus: mobileHighContrastTokens.focus,
  focusHalo: mobileHighContrastTokens.focusHalo,
  interactiveBorder: mobileHighContrastTokens.interactiveBorder,
  disabledBackground: mobileHighContrastTokens.disabledBackground,
  disabledText: mobileHighContrastTokens.disabledText,
  primaryHover: mobileHighContrastTokens.primaryHover,
  secondaryHover: mobileHighContrastTokens.secondaryHover,
  completionHover: mobileHighContrastTokens.completionHover,
}

function createResolvedColors(
  contrastLevel: ContrastLevel,
): SeniorEaseResolvedColors {
  return contrastLevel === 'maximum'
    ? maximumResolvedColors
    : standardResolvedColors
}

function createCssColorVariables(
  colors: SeniorEaseResolvedColors,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(seniorEaseColorVariableNames).map(
      ([colorName, variableName]) => [
        variableName,
        colors[colorName as keyof SeniorEaseResolvedColors],
      ],
    ),
  )
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
  const colors = seniorEaseColorValues

  if (contrastLevel === 'maximum') {
    return {
      mode: 'light',
      primary: {
        main: mobileHighContrastTokens.primaryButtonBackground,
        contrastText: mobileHighContrastTokens.primaryButtonText,
      },
      secondary: {
        main: mobileHighContrastTokens.chipSelectedBackground,
        contrastText: mobileHighContrastTokens.chipSelectedText,
      },
      success: {
        main: mobileHighContrastTokens.successBorder,
        contrastText: '#FFFFFF',
      },
      error: {
        main: mobileHighContrastTokens.dangerBorder,
        contrastText: '#FFFFFF',
      },
      warning: {
        main: mobileHighContrastTokens.topBarActionBackground,
        contrastText: mobileHighContrastTokens.topBarActionText,
      },
      info: {
        main: mobileHighContrastTokens.infoBorder,
        contrastText: '#FFFFFF',
      },
      background: {
        default: mobileHighContrastTokens.screenBackground,
        paper: mobileHighContrastTokens.cardBackground,
      },
      divider: mobileHighContrastTokens.cardBorder,
      text: {
        primary: mobileHighContrastTokens.textPrimary,
        secondary: mobileHighContrastTokens.textSecondary,
      },
      action: {
        disabled: mobileHighContrastTokens.disabledText,
        disabledBackground: mobileHighContrastTokens.disabledBackground,
        hover: 'rgba(0, 0, 0, 0.12)',
        selected: 'rgba(0, 0, 0, 0.16)',
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
      info: {
        main: colors.bluePressed,
        contrastText: colors.onPrimary,
      },
      background: {
        default: colors.surface,
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
    info: {
      main: colors.brandBlue,
      contrastText: colors.onPrimary,
    },
    background: {
      default: colors.surface,
      paper: colors.canvas,
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
  const resolvedColors = createResolvedColors(preferences.contrastLevel)
  const componentTokens = designTokens.components
  const touchTarget = touchTargetBySpacing[preferences.spacingLevel]
  const spacingBase = spacingBaseByLevel[preferences.spacingLevel]
  const focusStyles = {
    boxShadow: `0 0 0 6px ${colors.focusHalo}`,
    outline: `3px solid ${colors.focus}`,
    outlineOffset: 3,
  }
  const buttonPadding = `${Math.max(
    componentTokens.button.paddingY,
    spacingBase + 6,
  )}px ${Math.round(
    Math.max(componentTokens.button.paddingX, spacingBase * 2.5),
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
        ':root': createCssColorVariables(resolvedColors),
        body: {
          backgroundColor: palette.background.default,
          color: palette.text.primary,
        },
        '::selection': {
          backgroundColor: resolvedColors.brandBlue,
          color: resolvedColors.onPrimary,
        },
        a: {
          color: palette.secondary.main,
          textDecorationThickness: '0.12em',
          textUnderlineOffset: '0.18em',
          '&:hover': {
            textDecorationThickness: '0.2em',
          },
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
            backgroundColor: colors.disabledBackground,
            color: colors.disabledText,
            opacity: 1,
          },
          '&:hover': {
            boxShadow: `inset 0 0 0 2px ${colors.interactiveBorder}`,
          },
          '&.Mui-focusVisible': focusStyles,
          '&[aria-current="page"]': selectedState,
          '&[aria-pressed="true"]': {
            ...selectedState,
            boxShadow: `inset 0 0 0 2px ${colors.focus}`,
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
          backgroundColor: colors.canvas,
          color: colors.ink,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.focus,
            borderWidth: 2,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.interactiveBorder,
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
          color: colors.slate,
          fontSize: toScaledPx(
            designTokens.typography.caption.fontSize,
            preferences.fontScale,
          ),
          lineHeight: designTokens.typography.caption.lineHeight,
          '&.Mui-error': {
            color: palette.error.main,
            fontWeight: 600,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: colors.ink,
          '&.Mui-focused': {
            color: colors.ink,
          },
          '&.Mui-error': {
            color: palette.error.main,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: colors.ink,
          '&.Mui-checked': {
            color: colors.brandBlue,
          },
          '&.Mui-focusVisible': focusStyles,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colors.ink,
          '&.Mui-checked': {
            color: colors.brandBlue,
          },
          '&.Mui-focusVisible': focusStyles,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: touchTarget,
          '&:hover': {
            boxShadow: `inset 0 0 0 2px ${colors.interactiveBorder}`,
          },
          '&.Mui-focusVisible': focusStyles,
          '&[aria-selected="true"]': selectedState,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: touchTarget,
          '&:hover': {
            boxShadow: `inset 0 0 0 2px ${colors.interactiveBorder}`,
          },
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
          '&:hover': {
            boxShadow: `inset 0 0 0 2px ${colors.interactiveBorder}`,
          },
          '&.Mui-focusVisible': focusStyles,
          '&[aria-selected="true"]': selectedState,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          minHeight: Math.max(touchTarget, componentTokens.switch.height),
          minWidth: Math.max(touchTarget, componentTokens.switch.width),
          padding: 0,
          width: componentTokens.switch.width,
        },
        thumb: {
          height: componentTokens.switch.thumbSize,
          width: componentTokens.switch.thumbSize,
        },
        switchBase: {
          padding: componentTokens.switch.thumbInset,
          '&.Mui-focusVisible + .MuiSwitch-track': {
            boxShadow: `0 0 0 6px ${colors.focusHalo}`,
            outline: `3px solid ${colors.focus}`,
            outlineOffset: 3,
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: colors.successAccent,
            opacity: 1,
          },
        },
        track: {
          borderRadius: rounded.full,
          height: componentTokens.switch.height,
          opacity: 1,
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
          borderRadius: rounded.xl,
          boxShadow: isSimplified ? 'none' : undefined,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: colors.yellowLight,
          borderRadius: rounded.full,
          color: colors.ink,
          fontSize: toScaledPx(
            designTokens.typography.caption.fontSize,
            preferences.fontScale,
          ),
          fontWeight: designTokens.typography.caption.fontWeight,
          lineHeight: designTokens.typography.caption.lineHeight,
          minHeight: 36,
        },
        label: {
          paddingLeft: componentTokens.pill.paddingX,
          paddingRight: componentTokens.pill.paddingX,
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
          borderRadius: rounded.xl,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: `2px solid ${colors.hairline}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          border: '2px solid',
          borderRadius: rounded.md,
          fontSize: toScaledPx(
            designTokens.typography.body.fontSize,
            preferences.fontScale,
          ),
          minHeight: touchTarget,
          '&.MuiAlert-standardSuccess': {
            backgroundColor: colors.tealLight,
            borderColor: palette.success.main,
            color: colors.ink,
          },
          '&.MuiAlert-standardWarning': {
            backgroundColor: colors.yellowSoft,
            borderColor: palette.warning.main,
            color: colors.yellowDark,
          },
          '&.MuiAlert-standardError': {
            backgroundColor: colors.brandRed,
            borderColor: palette.error.main,
            color: colors.coralDark,
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor:
              preferences.contrastLevel === 'maximum'
                ? mobileHighContrastTokens.infoSurface
                : colors.surfaceSoft,
            borderColor: palette.info.main,
            color: colors.ink,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: palette.secondary.main,
          fontWeight: 600,
          textDecoration: 'underline',
          textDecorationThickness: '0.12em',
          textUnderlineOffset: '0.18em',
          '&:hover': {
            textDecorationThickness: '0.2em',
          },
          '&.Mui-focusVisible': focusStyles,
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
