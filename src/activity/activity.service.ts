import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ActivityRepository } from '../common/database/activity/repositories/activity.repository';
import { ActivityReadModel } from './models/activity-read.models';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async getProjectActivity(projectId: string): Promise<ActivityReadModel[]> {
    try {
      return await this.activityRepository.findByProject(projectId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve activity logs');
    }
  }
}