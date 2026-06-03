import type { Activity } from '../../domain/activities'
import type { ActivityRepository } from '../../application/ports'

export const ACTIVITY_STORAGE_NAME = 'seniorease-activities:v1'

interface ActivityStorageSnapshot {
  activities: Activity[]
}

function isActivity(input: unknown): input is Activity {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return false
  }

  const activity = input as Partial<Activity>

  return (
    typeof activity.id === 'string' &&
    typeof activity.title === 'string' &&
    typeof activity.createdAt === 'string' &&
    (activity.status === 'pending' ||
      activity.status === 'inProgress' ||
      activity.status === 'completed') &&
    Array.isArray(activity.steps)
  )
}

function readSnapshot(rawValue: string | null): ActivityStorageSnapshot {
  if (!rawValue) {
    return { activities: [] }
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<ActivityStorageSnapshot>

    return {
      activities: Array.isArray(parsedValue.activities)
        ? parsedValue.activities.filter(isActivity)
        : [],
    }
  } catch {
    return { activities: [] }
  }
}

export class LocalActivityRepository implements ActivityRepository {
  private memorySnapshot: ActivityStorageSnapshot = { activities: [] }

  private readAll(): Activity[] {
    if (typeof window === 'undefined') {
      return this.memorySnapshot.activities
    }

    return readSnapshot(window.localStorage.getItem(ACTIVITY_STORAGE_NAME))
      .activities
  }

  private writeAll(activities: Activity[]): void {
    const snapshot = { activities }

    if (typeof window === 'undefined') {
      this.memorySnapshot = snapshot
      return
    }

    window.localStorage.setItem(ACTIVITY_STORAGE_NAME, JSON.stringify(snapshot))
  }

  async listActivities(): Promise<Activity[]> {
    return this.readAll().filter((activity) => activity.status !== 'completed')
  }

  async saveActivity(activity: Activity): Promise<void> {
    const nextActivities = [
      ...this.readAll().filter((item) => item.id !== activity.id),
      activity,
    ]

    this.writeAll(nextActivities)
  }

  async deleteActivity(activityId: string): Promise<void> {
    this.writeAll(this.readAll().filter((activity) => activity.id !== activityId))
  }

  async listCompletedActivities(): Promise<Activity[]> {
    return this.readAll().filter((activity) => activity.status === 'completed')
  }
}
