import { validatePreferences } from '../../domain/preferences'
import type { UserPreferences } from '../../domain/preferences'
import type { PreferenceStatePort } from '../ports'

export class SavePreferencesUseCase {
  constructor(private readonly preferenceState: PreferenceStatePort) {}

  execute(input: unknown): UserPreferences {
    const preferences = validatePreferences(input)

    this.preferenceState.setPreferences(preferences)

    return preferences
  }
}
