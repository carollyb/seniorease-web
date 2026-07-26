import { createActivity } from '../../domain/activities'
import type { Activity, CreateActivityInput } from '../../domain/activities'
import type { ActivityRepository } from '../ports'

export class CreateActivityUseCase {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(input: CreateActivityInput): Promise<Activity> {
    const activity = createActivity(input)

    await this.activityRepository.saveActivity(activity)

    return activity
  }
}
