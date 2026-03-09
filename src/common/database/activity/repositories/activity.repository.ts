import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { ActivityReadModel } from '../../../../activity/models/activity-read.models';

@Injectable()
export class ActivityRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(
    data: { action: string; userId: string; projectId?: string; taskId?: string },
    options?: IQueryOptions,
  ): Promise<ActivityReadModel> {
    const { db } = this.parseOptions(options);

    try {
      const activity = await db.activityLog.create({
        data: {
          action: data.action,
          userId: data.userId,
          projectId: data.projectId ?? null,
          taskId: data.taskId ?? null,
        },
      });
      return ActivityReadModel.fromEntity(activity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to log activity', {
        cause: new Error(`Error logging activity: ${(error as any)?.message}`),
      });
    }
  }

  async findByProject(
    projectId: string,
    options?: IQueryOptions,
  ): Promise<ActivityReadModel[]> {
    const { db } = this.parseOptions(options);
    const logs = await db.activityLog.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    return logs.map((a: any) => ActivityReadModel.fromEntity(a));
  }
}