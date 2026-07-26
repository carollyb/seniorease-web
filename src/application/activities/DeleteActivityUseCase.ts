import type { ActivityRepository } from '../ports'

export class DeleteActivityUseCase {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(activityId: string): Promise<void> {
    return this.activityRepository.deleteActivity(activityId)
  }
}
