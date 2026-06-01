export type ActivityStatus = 'pending' | 'inProgress' | 'completed'

export interface ActivityStep {
  id: string
  label: string
  completed: boolean
}

export interface Activity {
  id: string
  title: string
  description?: string
  reminderText?: string
  status: ActivityStatus
  steps: ActivityStep[]
  createdAt: string
  completedAt?: string
}

export interface CreateActivityStepInput {
  id?: string
  label: string
  completed?: boolean
}

export interface CreateActivityInput {
  id?: string
  title: string
  description?: string
  reminderText?: string
  steps?: CreateActivityStepInput[]
  createdAt?: string
}

function createGeneratedId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createTimestamp(): string {
  return new Date().toISOString()
}

function requireTrimmedText(value: string, message: string): string {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw new Error(message)
  }

  return trimmedValue
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : undefined
}

function normalizeId(id: string | undefined, prefix: string): string {
  const trimmedId = id?.trim()

  return trimmedId || createGeneratedId(prefix)
}

function createActivityStep(step: CreateActivityStepInput): ActivityStep {
  return {
    id: normalizeId(step.id, 'step'),
    label: requireTrimmedText(step.label, 'Activity step label is required'),
    completed: false,
  }
}

export function createActivity(input: CreateActivityInput): Activity {
  const activity: Activity = {
    id: normalizeId(input.id, 'activity'),
    title: requireTrimmedText(input.title, 'Activity title is required'),
    status: 'pending',
    steps: input.steps?.map(createActivityStep) ?? [],
    createdAt: input.createdAt?.trim() || createTimestamp(),
  }

  const description = normalizeOptionalText(input.description)
  const reminderText = normalizeOptionalText(input.reminderText)

  if (description) {
    activity.description = description
  }

  if (reminderText) {
    activity.reminderText = reminderText
  }

  return activity
}

export function addActivityStep(
  activity: Activity,
  step: CreateActivityStepInput,
): Activity {
  if (activity.status === 'completed') {
    throw new Error('Completed activities cannot receive new steps')
  }

  return {
    ...activity,
    steps: [...activity.steps, createActivityStep(step)],
  }
}

export function completeActivity(
  activity: Activity,
  completedAt = createTimestamp(),
): Activity {
  return {
    ...activity,
    status: 'completed',
    steps: activity.steps.map((step) => ({
      ...step,
      completed: true,
    })),
    completedAt: activity.completedAt ?? completedAt,
  }
}
