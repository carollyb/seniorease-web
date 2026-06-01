import {
  addActivityStep,
  completeActivity,
  createActivity,
} from './Activity'

describe('Activity domain', () => {
  it('creates a pending activity from valid input', () => {
    const activity = createActivity({
      id: 'activity-1',
      title: ' Enviar trabalho ',
      description: ' Revisar arquivo final ',
      reminderText: ' Hoje as 18h ',
      steps: [{ id: 'step-1', label: ' Abrir a plataforma ' }],
      createdAt: '2026-06-01T12:00:00.000Z',
    })

    expect(activity).toEqual({
      id: 'activity-1',
      title: 'Enviar trabalho',
      description: 'Revisar arquivo final',
      reminderText: 'Hoje as 18h',
      status: 'pending',
      steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: false }],
      createdAt: '2026-06-01T12:00:00.000Z',
    })
  })

  it('rejects activities without a clear title', () => {
    expect(() =>
      createActivity({
        title: '   ',
      }),
    ).toThrow('Activity title is required')
  })

  it('rejects steps without a clear label', () => {
    expect(() =>
      createActivity({
        title: 'Enviar trabalho',
        steps: [{ label: '   ' }],
      }),
    ).toThrow('Activity step label is required')
  })

  it('adds a step without mutating the original activity', () => {
    const activity = createActivity({
      id: 'activity-1',
      title: 'Enviar trabalho',
      createdAt: '2026-06-01T12:00:00.000Z',
    })

    const updatedActivity = addActivityStep(activity, {
      id: 'step-1',
      label: 'Abrir a plataforma',
      completed: true,
    })

    expect(activity.steps).toEqual([])
    expect(updatedActivity.steps).toEqual([
      { id: 'step-1', label: 'Abrir a plataforma', completed: false },
    ])
  })

  it('marks an activity and its steps as completed', () => {
    const activity = createActivity({
      id: 'activity-1',
      title: 'Enviar trabalho',
      steps: [{ id: 'step-1', label: 'Abrir a plataforma' }],
      createdAt: '2026-06-01T12:00:00.000Z',
    })

    const completedActivity = completeActivity(
      activity,
      '2026-06-01T13:30:00.000Z',
    )

    expect(completedActivity).toEqual({
      ...activity,
      status: 'completed',
      steps: [{ id: 'step-1', label: 'Abrir a plataforma', completed: true }],
      completedAt: '2026-06-01T13:30:00.000Z',
    })
  })
})
