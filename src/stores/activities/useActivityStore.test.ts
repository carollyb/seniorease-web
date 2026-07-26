import type { Activity, CreateActivityInput } from '../../domain/activities'
import {
  createActivityStore,
  type ActivityStoreUseCases,
} from './useActivityStore'

const pendingActivity: Activity = {
  id: 'activity-1',
  title: 'Enviar trabalho',
  reminderText: 'Hoje as 18h',
  status: 'pending',
  steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: false }],
  createdAt: '2026-06-01T12:00:00.000Z',
}

const completedActivity: Activity = {
  ...pendingActivity,
  status: 'completed',
  steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: true }],
  completedAt: '2026-06-01T13:30:00.000Z',
}

function createUseCases(): jest.Mocked<ActivityStoreUseCases> {
  return {
    createActivity: { execute: jest.fn() },
    completeActivity: { execute: jest.fn() },
    deleteActivity: { execute: jest.fn() },
    listActivities: { execute: jest.fn() },
    listCompletedActivities: { execute: jest.fn() },
  }
}

describe('Activity Zustand store', () => {
  it('loads active and completed activities through use cases', async () => {
    const useCases = createUseCases()
    useCases.listActivities.execute.mockResolvedValue([pendingActivity])
    useCases.listCompletedActivities.execute.mockResolvedValue([
      completedActivity,
    ])
    const store = createActivityStore(useCases)

    await store.getState().loadActivities()

    expect(useCases.listActivities.execute).toHaveBeenCalledTimes(1)
    expect(useCases.listCompletedActivities.execute).toHaveBeenCalledTimes(1)
    expect(store.getState()).toMatchObject({
      activities: [pendingActivity],
      completedActivities: [completedActivity],
      isLoading: false,
      errorMessage: null,
    })
  })

  it('passes creation input to the use case and refreshes store state', async () => {
    const useCases = createUseCases()
    const input: CreateActivityInput = {
      title: ' Enviar trabalho ',
      reminderText: ' Hoje as 18h ',
    }
    useCases.createActivity.execute.mockResolvedValue(pendingActivity)
    useCases.listActivities.execute.mockResolvedValue([pendingActivity])
    useCases.listCompletedActivities.execute.mockResolvedValue([])
    const store = createActivityStore(useCases)

    const activity = await store.getState().createActivity(input)

    expect(useCases.createActivity.execute).toHaveBeenCalledWith(input)
    expect(activity).toEqual(pendingActivity)
    expect(store.getState().activities).toEqual([pendingActivity])
  })

  it('completes an activity through the use case and refreshes history', async () => {
    const useCases = createUseCases()
    useCases.completeActivity.execute.mockResolvedValue(completedActivity)
    useCases.listActivities.execute.mockResolvedValue([])
    useCases.listCompletedActivities.execute.mockResolvedValue([
      completedActivity,
    ])
    const store = createActivityStore(useCases)

    store.getState().selectActivity('activity-1')
    const activity = await store.getState().completeActivity('activity-1')

    expect(useCases.completeActivity.execute).toHaveBeenCalledWith(
      'activity-1',
    )
    expect(activity).toEqual(completedActivity)
    expect(store.getState()).toMatchObject({
      activities: [],
      completedActivities: [completedActivity],
      selectedActivityId: null,
      isLoading: false,
      errorMessage: null,
    })
  })

  it('deletes an activity, clears its selection, and refreshes both lists', async () => {
    const useCases = createUseCases()
    useCases.deleteActivity.execute.mockResolvedValue(undefined)
    useCases.listActivities.execute.mockResolvedValue([])
    useCases.listCompletedActivities.execute.mockResolvedValue([])
    const store = createActivityStore(useCases)

    store.setState({
      activities: [pendingActivity],
      completedActivities: [completedActivity],
      selectedActivityId: 'activity-1',
    })

    await store.getState().deleteActivity('activity-1')

    expect(useCases.deleteActivity.execute).toHaveBeenCalledWith('activity-1')
    expect(store.getState()).toMatchObject({
      activities: [],
      completedActivities: [],
      selectedActivityId: null,
      isLoading: false,
      errorMessage: null,
    })
  })

  it('keeps use case errors in coordination state', async () => {
    const useCases = createUseCases()
    useCases.listActivities.execute.mockRejectedValue(
      new Error('Activities unavailable'),
    )
    useCases.listCompletedActivities.execute.mockResolvedValue([])
    const store = createActivityStore(useCases)

    await store.getState().loadActivities()

    expect(store.getState()).toMatchObject({
      activities: [],
      completedActivities: [],
      isLoading: false,
      errorMessage: 'Activities unavailable',
    })

    store.getState().clearError()

    expect(store.getState().errorMessage).toBeNull()
  })
})
