import type { Activity } from '../../domain/activities'
import type { ActivityRepository } from '../ports'
import {
  CompleteActivityUseCase,
  CreateActivityUseCase,
  ListActivitiesUseCase,
  ListCompletedActivitiesUseCase,
} from './'

function createActivityRepository(): jest.Mocked<ActivityRepository> {
  return {
    listActivities: jest.fn(),
    saveActivity: jest.fn(),
    deleteActivity: jest.fn(),
    listCompletedActivities: jest.fn(),
  }
}

const pendingActivity: Activity = {
  id: 'activity-1',
  title: 'Enviar trabalho',
  description: 'Revisar arquivo final',
  reminderText: 'Hoje as 18h',
  status: 'pending',
  steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: false }],
  createdAt: '2026-06-01T12:00:00.000Z',
}

describe('Activity application use cases', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('creates a validated activity and saves it through the repository port', async () => {
    const repository = createActivityRepository()

    const activity = await new CreateActivityUseCase(repository).execute({
      id: 'activity-1',
      title: ' Enviar trabalho ',
      description: ' Revisar arquivo final ',
      reminderText: ' Hoje as 18h ',
      steps: [{ id: 'step-1', label: ' Abrir a plataforma ' }],
      createdAt: '2026-06-01T12:00:00.000Z',
    })

    expect(activity).toEqual(pendingActivity)
    expect(repository.saveActivity).toHaveBeenCalledWith(pendingActivity)
  })

  it('lists active activities from the repository port', async () => {
    const repository = createActivityRepository()
    repository.listActivities.mockResolvedValue([pendingActivity])

    const activities = await new ListActivitiesUseCase(repository).execute()

    expect(repository.listActivities).toHaveBeenCalledTimes(1)
    expect(activities).toEqual([pendingActivity])
  })

  it('completes an activity found in the repository and saves the transition', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-01T13:30:00.000Z'))
    const repository = createActivityRepository()
    repository.listActivities.mockResolvedValue([pendingActivity])

    const completedActivity = await new CompleteActivityUseCase(
      repository,
    ).execute('activity-1')

    expect(completedActivity).toEqual({
      ...pendingActivity,
      status: 'completed',
      steps: [
        { id: 'step-1', label: 'Abrir a plataforma', completed: true },
      ],
      completedAt: '2026-06-01T13:30:00.000Z',
    })
    expect(repository.saveActivity).toHaveBeenCalledWith(completedActivity)
  })

  it('rejects completion when the activity cannot be found', async () => {
    const repository = createActivityRepository()
    repository.listActivities.mockResolvedValue([])

    await expect(
      new CompleteActivityUseCase(repository).execute('missing-activity'),
    ).rejects.toThrow('Activity not found')
    expect(repository.saveActivity).not.toHaveBeenCalled()
  })

  it('lists completed activity history from the repository port', async () => {
    const completedActivity: Activity = {
      ...pendingActivity,
      status: 'completed',
      steps: [
        { id: 'step-1', label: 'Abrir a plataforma', completed: true },
      ],
      completedAt: '2026-06-01T13:30:00.000Z',
    }
    const repository = createActivityRepository()
    repository.listCompletedActivities.mockResolvedValue([completedActivity])

    const completedActivities = await new ListCompletedActivitiesUseCase(
      repository,
    ).execute()

    expect(repository.listCompletedActivities).toHaveBeenCalledTimes(1)
    expect(completedActivities).toEqual([completedActivity])
  })
})
