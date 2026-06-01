import { createDefaultPreferences } from '../../domain/preferences'
import type { UserPreferences } from '../../domain/preferences'
import type { PreferenceStatePort } from '../ports'

export class ResetPreferencesUseCase {
  constructor(private readonly preferenceState: PreferenceStatePort) {}

  execute(): UserPreferences {
    this.preferenceState.resetPreferences()

    return createDefaultPreferences()
  }
}
