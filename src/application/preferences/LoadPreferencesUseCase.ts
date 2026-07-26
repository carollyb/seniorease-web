import { validatePreferences } from '../../domain/preferences'
import type { UserPreferences } from '../../domain/preferences'
import type { PreferenceStatePort } from '../ports'

export class LoadPreferencesUseCase {
  constructor(private readonly preferenceState: PreferenceStatePort) {}

  execute(): UserPreferences {
    return validatePreferences(this.preferenceState.getPreferences())
  }
}
