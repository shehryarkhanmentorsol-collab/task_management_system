import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { CreateTaskModel } from 'src/task/models/create-task.model';
import { UpdateTaskModel } from 'src/task/models/update-task.model';
import { GetTasksModel } from 'src/task/models/get-tasks.model';
import { TaskReadModel } from 'src/task/models/task-read.model';
import { UserRole } from '../../../enums/roles.enum';

@Injectable()
export class TaskRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(
    model: CreateTaskModel,
    options?: IQueryOptions,
  ): Promise<TaskReadModel> {
    const { db } = this.parseOptions(options);

    try {
      const task = await db.task.create({
        data: {
          title: model.title,
          description: model.description ?? null,
          status: model.status,
          priority: model.priority,
          assignedTo: model.assignedTo ?? null,
          projectId: model.projectId,
          dueDate: model.dueDate ?? null,
        },
      });
      return TaskReadModel.fromEntity(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task', {
        cause: new Error(`Error creating task: ${error?.message}`),
      });
    }
  }

  async findAll(
    model: GetTasksModel,
    options?: IQueryOptions,
  ): Promise<[TaskReadModel[], number]> {
    const { db } = this.parseOptions(options);

    try {
      const where: any = {};

      if (model.projectId) where.projectId = model.projectId;
      if (model.status) where.status = model.status;
      if (model.priority) where.priority = model.priority;

      const skip = (model.page - 1) * model.limit;

      const [tasks, total] = await Promise.all([
        db.task.findMany({
          where,
          skip,
          take: model.limit,
          orderBy: { createdAt: 'desc' },
        }),
        db.task.count({ where }),
      ]);

      return [tasks.map((t: any) => TaskReadModel.fromEntity(t)), total];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tasks', {
        cause: new Error(`Error fetching tasks: ${error?.message}`),
      });
    }
  }

  async update(
    model: UpdateTaskModel,
    userId: string,
    userRole: UserRole,
    options?: IQueryOptions,
  ): Promise<TaskReadModel> {
    const { db } = this.parseOptions(options);

    const task = await db.task.findUnique({ where: { id: model.id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${model.id} not found`);
    }

    if (userRole !== UserRole.ADMIN && task.assignedTo !== userId) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    try {
      const updated = await db.task.update({
        where: { id: model.id },
        data: {
          ...(model.title !== undefined && { title: model.title }),
          ...(model.description !== undefined && { description: model.description }),
          ...(model.status !== undefined && { status: model.status }),
          ...(model.priority !== undefined && { priority: model.priority }),
          ...(model.assignedTo !== undefined && { assignedTo: model.assignedTo }),
          ...(model.dueDate !== undefined && { dueDate: model.dueDate }),
        },
      });
      return TaskReadModel.fromEntity(updated);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update task', {
        cause: new Error(`Error updating task: ${error?.message}`),
      });
    }
  }

  async delete(
    id: string,
    userId: string,
    userRole: UserRole,
    options?: IQueryOptions,
  ): Promise<void> {
    const { db } = this.parseOptions(options);

    const task = await db.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (userRole !== UserRole.ADMIN && task.assignedTo !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    try {
      await db.task.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete task', {
        cause: new Error(`Error deleting task: ${error?.message}`),
      });
    }
  }
}