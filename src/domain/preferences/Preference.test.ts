import {
  DEFAULT_USER_PREFERENCES,
  createDefaultPreferences,
  isUserPreferences,
  validatePreferences,
} from './Preference'

describe('UserPreferences domain', () => {
  it('creates accessible default preferences that pass validation', () => {
    const preferences = createDefaultPreferences()

    expect(preferences).toEqual(DEFAULT_USER_PREFERENCES)
    expect(isUserPreferences(preferences)).toBe(true)
    expect(validatePreferences(preferences)).toEqual(preferences)
  })

  it('returns a fresh preferences object for defaults', () => {
    const first = createDefaultPreferences()
    const second = createDefaultPreferences()

    expect(first).toEqual(second)
    expect(first).not.toBe(second)
  })

  it('keeps valid preference fields and replaces invalid fields with defaults', () => {
    const preferences = validatePreferences({
      fontScale: 'extraLarge',
      contrastLevel: 'not-valid',
      spacingLevel: 'extraWide',
      navigationMode: 'standard',
      reinforcedFeedback: false,
      extraConfirmation: 'yes',
      remindersEnabled: false,
      reminderTone: 'direct',
    })

    expect(preferences).toEqual({
      ...DEFAULT_USER_PREFERENCES,
      fontScale: 'extraLarge',
      spacingLevel: 'extraWide',
      navigationMode: 'standard',
      reinforcedFeedback: false,
      remindersEnabled: false,
      reminderTone: 'direct',
    })
  })

  it('recovers non-object input to defaults', () => {
    expect(validatePreferences(null)).toEqual(DEFAULT_USER_PREFERENCES)
    expect(validatePreferences('invalid')).toEqual(DEFAULT_USER_PREFERENCES)
  })
})
