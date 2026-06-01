import {
  DEFAULT_USER_PREFERENCES,
  createDefaultPreferences,
  type UserPreferences,
} from '../../domain/preferences'
import type { PreferenceStatePort } from '../ports'
import {
  LoadPreferencesUseCase,
  ResetPreferencesUseCase,
  SavePreferencesUseCase,
} from './'

function createPreferenceState(
  preferences: UserPreferences = createDefaultPreferences(),
): jest.Mocked<PreferenceStatePort> {
  return {
    getPreferences: jest.fn(() => preferences),
    setPreferences: jest.fn(),
    resetPreferences: jest.fn(),
  }
}

describe('Preference application use cases', () => {
  it('loads preferences through the preference state port', () => {
    const preferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      fontScale: 'extraLarge',
      navigationMode: 'standard',
    }
    const preferenceState = createPreferenceState(preferences)

    const loadedPreferences = new LoadPreferencesUseCase(
      preferenceState,
    ).execute()

    expect(preferenceState.getPreferences).toHaveBeenCalledTimes(1)
    expect(loadedPreferences).toEqual(preferences)
  })

  it('validates preferences before saving them through the port', () => {
    const preferenceState = createPreferenceState()

    const savedPreferences = new SavePreferencesUseCase(
      preferenceState,
    ).execute({
      ...DEFAULT_USER_PREFERENCES,
      fontScale: 'extraLarge',
      contrastLevel: 'not-valid',
      reinforcedFeedback: false,
      reminderTone: 'direct',
    })

    expect(savedPreferences).toEqual({
      ...DEFAULT_USER_PREFERENCES,
      fontScale: 'extraLarge',
      reinforcedFeedback: false,
      reminderTone: 'direct',
    })
    expect(preferenceState.setPreferences).toHaveBeenCalledWith(
      savedPreferences,
    )
  })

  it('resets preferences through the port and returns accessible defaults', () => {
    const preferenceState = createPreferenceState()

    const resetPreferences = new ResetPreferencesUseCase(
      preferenceState,
    ).execute()

    expect(preferenceState.resetPreferences).toHaveBeenCalledTimes(1)
    expect(resetPreferences).toEqual(DEFAULT_USER_PREFERENCES)
    expect(resetPreferences).not.toBe(DEFAULT_USER_PREFERENCES)
  })
})
