import type { StateStorage } from 'zustand/middleware'

import {
  DEFAULT_USER_PREFERENCES,
  type UserPreferences,
} from '../../domain/preferences'
import {
  PREFERENCE_PERSISTENCE_WARNING,
  PREFERENCE_STORAGE_NAME,
  createPreferenceStore,
} from './usePreferenceStore'

interface TestStorage extends StateStorage {
  getStoredValue(name: string): string | null
}

function createTestStorage(initialItems: Record<string, string> = {}): TestStorage {
  const items = new Map(Object.entries(initialItems))

  return {
    getItem: (name) => items.get(name) ?? null,
    setItem: (name, value) => {
      items.set(name, value)
    },
    removeItem: (name) => {
      items.delete(name)
    },
    getStoredValue: (name) => items.get(name) ?? null,
  }
}

function createStoredPreferences(preferences: unknown): string {
  return JSON.stringify({
    state: { preferences },
    version: 1,
  })
}

describe('Preference Zustand store', () => {
  it('validates and persists saved preferences through Zustand persist', () => {
    const storage = createTestStorage()
    const store = createPreferenceStore({ storage })

    const savedPreferences = store.getState().setPreferences({
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
    expect(store.getState().preferences).toEqual(savedPreferences)

    const persistedValue = JSON.parse(
      storage.getStoredValue(PREFERENCE_STORAGE_NAME) ?? '',
    )

    expect(persistedValue).toEqual({
      state: { preferences: savedPreferences },
      version: 1,
    })
  })

  it('hydrates and loads preferences from persisted storage', async () => {
    const persistedPreferences: UserPreferences = {
      ...DEFAULT_USER_PREFERENCES,
      fontScale: 'extraLarge',
      navigationMode: 'standard',
      reminderTone: 'direct',
    }
    const storage = createTestStorage({
      [PREFERENCE_STORAGE_NAME]: createStoredPreferences(persistedPreferences),
    })
    const store = createPreferenceStore({ storage })

    expect(store.getState().hasHydrated).toBe(false)

    await store.getState().hydratePreferences()

    expect(store.getState().hasHydrated).toBe(true)
    expect(store.getState().loadPreferences()).toEqual(persistedPreferences)
    expect(store.getState().preferences).toEqual(persistedPreferences)
  })

  it('recovers invalid persisted preference data to accessible defaults', async () => {
    const storage = createTestStorage({
      [PREFERENCE_STORAGE_NAME]: createStoredPreferences({
        fontScale: 'tiny',
        contrastLevel: 'low',
        spacingLevel: 'crowded',
        navigationMode: 'maze',
        reinforcedFeedback: 'yes',
        extraConfirmation: 'yes',
        remindersEnabled: 'sometimes',
        reminderTone: 'loud',
      }),
    })
    const store = createPreferenceStore({ storage })

    await store.getState().hydratePreferences()

    expect(store.getState().preferences).toEqual(DEFAULT_USER_PREFERENCES)
    expect(store.getState().hasHydrated).toBe(true)
  })

  it('keeps the session usable and warns when persistence is unavailable', async () => {
    const unavailableStorage: StateStorage = {
      getItem: () => {
        throw new Error('Storage unavailable')
      },
      setItem: () => {
        throw new Error('Storage unavailable')
      },
      removeItem: () => {
        throw new Error('Storage unavailable')
      },
    }
    const store = createPreferenceStore({ storage: unavailableStorage })

    await store.getState().hydratePreferences()
    const savedPreferences = store.getState().setPreferences({
      ...DEFAULT_USER_PREFERENCES,
      remindersEnabled: false,
      reminderTone: 'direct',
    })

    expect(savedPreferences).toEqual({
      ...DEFAULT_USER_PREFERENCES,
      remindersEnabled: false,
      reminderTone: 'direct',
    })
    expect(store.getState().preferences).toEqual(savedPreferences)
    expect(store.getState().persistenceWarning).toBe(
      PREFERENCE_PERSISTENCE_WARNING,
    )
  })
})
