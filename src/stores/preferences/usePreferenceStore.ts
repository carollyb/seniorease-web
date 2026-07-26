import { create, type StoreApi, type UseBoundStore } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'

import {
  createDefaultPreferences,
  validatePreferences,
  type UserPreferences,
} from '../../domain/preferences'
import type { PreferenceStatePort } from '../../application/ports'
import {
  LoadPreferencesUseCase,
  ResetPreferencesUseCase,
  SavePreferencesUseCase,
} from '../../application/preferences'

export const PREFERENCE_STORAGE_NAME = 'seniorease-preferences:v1'
export const PREFERENCE_PERSISTENCE_WARNING =
  'Suas preferencias continuam ativas nesta sessao, mas talvez nao sejam salvas ao fechar o navegador.'

interface PreferencePersistedState {
  preferences: UserPreferences
}

interface PreferenceStorageStatus {
  hasWarning: boolean
}

type PreferenceStoreApi = UseBoundStore<
  StoreApi<PreferenceStoreState> & {
    persist: {
      rehydrate: () => Promise<void> | void
    }
  }
>

export interface PreferenceStoreState {
  preferences: UserPreferences
  hasHydrated: boolean
  persistenceWarning: string | null
  hydratePreferences(): Promise<void>
  loadPreferences(): UserPreferences
  setPreferences(input: unknown): UserPreferences
  resetPreferences(): UserPreferences
}

export interface PreferenceStoreOptions {
  storage?: StateStorage
}

function createMemoryStorage(): StateStorage {
  const items = new Map<string, string>()

  return {
    getItem: (name) => items.get(name) ?? null,
    setItem: (name, value) => {
      items.set(name, value)
    },
    removeItem: (name) => {
      items.delete(name)
    },
  }
}

function createSafeStorage(
  status: PreferenceStorageStatus,
  storage?: StateStorage,
): StateStorage {
  const fallbackStorage = createMemoryStorage()

  function resolveStorage(): StateStorage {
    if (storage) {
      return storage
    }

    if (typeof window === 'undefined') {
      return fallbackStorage
    }

    try {
      return window.localStorage
    } catch {
      status.hasWarning = true
      return fallbackStorage
    }
  }

  return {
    getItem: (name) => {
      try {
        return resolveStorage().getItem(name)
      } catch {
        status.hasWarning = true
        return fallbackStorage.getItem(name)
      }
    },
    setItem: (name, value) => {
      try {
        return resolveStorage().setItem(name, value)
      } catch {
        status.hasWarning = true
        return fallbackStorage.setItem(name, value)
      }
    },
    removeItem: (name) => {
      try {
        return resolveStorage().removeItem(name)
      } catch {
        status.hasWarning = true
        return fallbackStorage.removeItem(name)
      }
    },
  }
}

function readPersistedPreferences(input: unknown): unknown {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return undefined
  }

  return (input as Partial<PreferencePersistedState>).preferences
}

export function createPreferenceStore(options: PreferenceStoreOptions = {}) {
  const storageStatus: PreferenceStorageStatus = { hasWarning: false }
  let preferenceStore: PreferenceStoreApi | undefined

  const syncPersistenceWarning = () => {
    const state = preferenceStore?.getState()

    if (!state) {
      return
    }

    if (storageStatus.hasWarning && !state.persistenceWarning) {
      preferenceStore?.setState({
        persistenceWarning: PREFERENCE_PERSISTENCE_WARNING,
      })
    }
  }

  preferenceStore = create<PreferenceStoreState>()(
    persist(
      (set, get) => {
        const preferenceState: PreferenceStatePort = {
          getPreferences: () => get().preferences,
          setPreferences: (preferences) => {
            set({ preferences, persistenceWarning: null })
          },
          resetPreferences: () => {
            set({
              preferences: createDefaultPreferences(),
              persistenceWarning: null,
            })
          },
        }

        const loadPreferencesUseCase = new LoadPreferencesUseCase(
          preferenceState,
        )
        const savePreferencesUseCase = new SavePreferencesUseCase(
          preferenceState,
        )
        const resetPreferencesUseCase = new ResetPreferencesUseCase(
          preferenceState,
        )

        return {
          preferences: createDefaultPreferences(),
          hasHydrated: false,
          persistenceWarning: null,
          hydratePreferences: async () => {
            await preferenceStore?.persist.rehydrate()
            syncPersistenceWarning()
          },
          loadPreferences: () => {
            const preferences = loadPreferencesUseCase.execute()

            set({ preferences })
            syncPersistenceWarning()

            return preferences
          },
          setPreferences: (input) => {
            const preferences = savePreferencesUseCase.execute(input)

            syncPersistenceWarning()

            return preferences
          },
          resetPreferences: () => {
            const preferences = resetPreferencesUseCase.execute()

            syncPersistenceWarning()

            return preferences
          },
        }
      },
      {
        name: PREFERENCE_STORAGE_NAME,
        version: 1,
        storage: createJSONStorage(() =>
          createSafeStorage(storageStatus, options.storage),
        ),
        partialize: (state): PreferencePersistedState => ({
          preferences: state.preferences,
        }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          preferences: validatePreferences(
            readPersistedPreferences(persistedState),
          ),
        }),
        onRehydrateStorage: () => (_hydratedState, error) => {
          const currentState = preferenceStore?.getState()

          if (!currentState) {
            return
          }

          preferenceStore?.setState({
            hasHydrated: true,
            persistenceWarning:
              error || storageStatus.hasWarning
                ? PREFERENCE_PERSISTENCE_WARNING
                : currentState.persistenceWarning,
          })
          syncPersistenceWarning()
        },
        skipHydration: true,
      },
    ),
  )

  return preferenceStore
}

export const usePreferenceStore = createPreferenceStore()
