import { create } from 'zustand'

import type {
  Activity,
  CreateActivityInput,
} from '../../domain/activities'

interface CreateActivityExecutor {
  execute(input: CreateActivityInput): Promise<Activity>
}

interface CompleteActivityExecutor {
  execute(activityId: string): Promise<Activity>
}

interface DeleteActivityExecutor {
  execute(activityId: string): Promise<void>
}

interface ListActivitiesExecutor {
  execute(): Promise<Activity[]>
}

export interface ActivityStoreUseCases {
  createActivity: CreateActivityExecutor
  completeActivity: CompleteActivityExecutor
  deleteActivity: DeleteActivityExecutor
  listActivities: ListActivitiesExecutor
  listCompletedActivities: ListActivitiesExecutor
}

export interface ActivityStoreState {
  activities: Activity[]
  completedActivities: Activity[]
  selectedActivityId: string | null
  isLoading: boolean
  errorMessage: string | null
  loadActivities(): Promise<void>
  createActivity(input: CreateActivityInput): Promise<Activity>
  completeActivity(activityId: string): Promise<Activity>
  deleteActivity(activityId: string): Promise<void>
  selectActivity(activityId: string | null): void
  clearError(): void
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Nao foi possivel atualizar as atividades.'
}

export function createActivityStore(useCases: ActivityStoreUseCases) {
  return create<ActivityStoreState>()((set, get) => ({
    activities: [],
    completedActivities: [],
    selectedActivityId: null,
    isLoading: false,
    errorMessage: null,
    loadActivities: async () => {
      set({ isLoading: true, errorMessage: null })

      try {
        const [activities, completedActivities] = await Promise.all([
          useCases.listActivities.execute(),
          useCases.listCompletedActivities.execute(),
        ])

        set({
          activities,
          completedActivities,
          isLoading: false,
        })
      } catch (error) {
        set({
          isLoading: false,
          errorMessage: getErrorMessage(error),
        })
      }
    },
    createActivity: async (input) => {
      set({ isLoading: true, errorMessage: null })

      try {
        const activity = await useCases.createActivity.execute(input)

        await get().loadActivities()

        return activity
      } catch (error) {
        set({
          isLoading: false,
          errorMessage: getErrorMessage(error),
        })
        throw error
      }
    },
    completeActivity: async (activityId) => {
      set({ isLoading: true, errorMessage: null })

      try {
        const activity = await useCases.completeActivity.execute(activityId)

        set((state) => ({
          selectedActivityId:
            state.selectedActivityId === activityId
              ? null
              : state.selectedActivityId,
        }))
        await get().loadActivities()

        return activity
      } catch (error) {
        set({
          isLoading: false,
          errorMessage: getErrorMessage(error),
        })
        throw error
      }
    },
    deleteActivity: async (activityId) => {
      set({ isLoading: true, errorMessage: null })

      try {
        await useCases.deleteActivity.execute(activityId)

        set((state) => ({
          selectedActivityId:
            state.selectedActivityId === activityId
              ? null
              : state.selectedActivityId,
        }))
        await get().loadActivities()
      } catch (error) {
        set({
          isLoading: false,
          errorMessage: getErrorMessage(error),
        })
        throw error
      }
    },
    selectActivity: (activityId) => {
      set({ selectedActivityId: activityId })
    },
    clearError: () => {
      set({ errorMessage: null })
    },
  }))
}
