import type { Activity } from '../../domain/activities'
import type { ActivityRepository } from '../ports'

export class ListCompletedActivitiesUseCase {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(): Promise<Activity[]> {
    return this.activityRepository.listCompletedActivities()
  }
}
