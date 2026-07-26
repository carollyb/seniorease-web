import { completeActivity } from '../../domain/activities'
import type { Activity } from '../../domain/activities'
import type { ActivityRepository } from '../ports'

export class CompleteActivityUseCase {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(activityId: string): Promise<Activity> {
    const activities = await this.activityRepository.listActivities()
    const activity = activities.find((item) => item.id === activityId)

    if (!activity) {
      throw new Error('Activity not found')
    }

    const completedActivity = completeActivity(activity)

    await this.activityRepository.saveActivity(completedActivity)

    return completedActivity
  }
}
