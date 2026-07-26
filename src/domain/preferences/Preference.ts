export const FONT_SCALES = ['small', 'medium', 'large', 'extraLarge'] as const
export const CONTRAST_LEVELS = ['standard', 'high', 'maximum'] as const
export const SPACING_LEVELS = ['comfortable', 'wide', 'extraWide'] as const
export const NAVIGATION_MODES = ['simplified', 'standard'] as const
export const REMINDER_TONES = ['direct', 'gentle'] as const

export type FontScale = (typeof FONT_SCALES)[number]
export type ContrastLevel = (typeof CONTRAST_LEVELS)[number]
export type SpacingLevel = (typeof SPACING_LEVELS)[number]
export type NavigationMode = (typeof NAVIGATION_MODES)[number]
export type ReminderTone = (typeof REMINDER_TONES)[number]

export interface UserPreferences {
  fontScale: FontScale
  contrastLevel: ContrastLevel
  spacingLevel: SpacingLevel
  navigationMode: NavigationMode
  reinforcedFeedback: boolean
  extraConfirmation: boolean
  remindersEnabled: boolean
  reminderTone: ReminderTone
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  fontScale: 'large',
  contrastLevel: 'high',
  spacingLevel: 'wide',
  navigationMode: 'simplified',
  reinforcedFeedback: true,
  extraConfirmation: true,
  remindersEnabled: true,
  reminderTone: 'gentle',
}

type PreferenceRecord = Record<string, unknown>

function isRecord(input: unknown): input is PreferenceRecord {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}

function isOneOf<TValue extends string>(
  values: readonly TValue[],
  input: unknown,
): input is TValue {
  return typeof input === 'string' && values.includes(input as TValue)
}

export function createDefaultPreferences(): UserPreferences {
  return { ...DEFAULT_USER_PREFERENCES }
}

export function validatePreferences(input: unknown): UserPreferences {
  const defaults = createDefaultPreferences()

  if (!isRecord(input)) {
    return defaults
  }

  return {
    fontScale: isOneOf(FONT_SCALES, input.fontScale)
      ? input.fontScale
      : defaults.fontScale,
    contrastLevel: isOneOf(CONTRAST_LEVELS, input.contrastLevel)
      ? input.contrastLevel
      : defaults.contrastLevel,
    spacingLevel: isOneOf(SPACING_LEVELS, input.spacingLevel)
      ? input.spacingLevel
      : defaults.spacingLevel,
    navigationMode: isOneOf(NAVIGATION_MODES, input.navigationMode)
      ? input.navigationMode
      : defaults.navigationMode,
    reinforcedFeedback:
      typeof input.reinforcedFeedback === 'boolean'
        ? input.reinforcedFeedback
        : defaults.reinforcedFeedback,
    extraConfirmation:
      typeof input.extraConfirmation === 'boolean'
        ? input.extraConfirmation
        : defaults.extraConfirmation,
    remindersEnabled:
      typeof input.remindersEnabled === 'boolean'
        ? input.remindersEnabled
        : defaults.remindersEnabled,
    reminderTone: isOneOf(REMINDER_TONES, input.reminderTone)
      ? input.reminderTone
      : defaults.reminderTone,
  }
}

export function isUserPreferences(input: unknown): input is UserPreferences {
  if (!isRecord(input)) {
    return false
  }

  return (
    isOneOf(FONT_SCALES, input.fontScale) &&
    isOneOf(CONTRAST_LEVELS, input.contrastLevel) &&
    isOneOf(SPACING_LEVELS, input.spacingLevel) &&
    isOneOf(NAVIGATION_MODES, input.navigationMode) &&
    typeof input.reinforcedFeedback === 'boolean' &&
    typeof input.extraConfirmation === 'boolean' &&
    typeof input.remindersEnabled === 'boolean' &&
    isOneOf(REMINDER_TONES, input.reminderTone)
  )
}
