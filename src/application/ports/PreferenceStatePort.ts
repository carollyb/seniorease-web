import type { UserPreferences } from '../../domain/preferences'

export interface PreferenceStatePort {
  getPreferences(): UserPreferences
  setPreferences(preferences: UserPreferences): void
  resetPreferences(): void
}
