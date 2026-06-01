import type { Activity } from '../../domain/activities'

export interface ActivityRepository {
  listActivities(): Promise<Activity[]>
  saveActivity(activity: Activity): Promise<void>
  deleteActivity(activityId: string): Promise<void>
  listCompletedActivities(): Promise<Activity[]>
}
