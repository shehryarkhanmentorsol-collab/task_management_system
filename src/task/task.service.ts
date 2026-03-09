import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskRepository } from '../common/database/task/repositories/task.repository';
import { CreateTaskModel } from './models/create-task.model';
import { UpdateTaskModel } from './models/update-task.model';
import { GetTasksModel } from './models/get-task.model';
import { TaskReadModel } from './models/task-read.model';
import { UserRole } from '../user/enums/user.enum';
import { ACTIVITY_EVENTS } from '../project/activity-events/activity.events';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(model: CreateTaskModel, userId: string): Promise<TaskReadModel> {
    try {
      const task = await this.taskRepository.create(model);

      this.eventEmitter.emit(ACTIVITY_EVENTS.TASK_CREATED, {
        action: ACTIVITY_EVENTS.TASK_CREATED,
        userId,
        projectId: model.projectId,
        taskId: task.id,
      });

      return task;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(
    model: GetTasksModel,
  ): Promise<{ items: TaskReadModel[]; total: number }> {
    try {
      const [items, total] = await this.taskRepository.findAll(model);
      return { items, total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async update(
    model: UpdateTaskModel,
    userId: string,
    userRole: UserRole,
  ): Promise<TaskReadModel> {
    try {
      const task = await this.taskRepository.update(model, userId, userRole);

      this.eventEmitter.emit(ACTIVITY_EVENTS.TASK_UPDATED, {
        action: ACTIVITY_EVENTS.TASK_UPDATED,
        userId,
        taskId: task.id,
        projectId: task.projectId,
      });

      return task;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  async delete(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<void> {
    try {
      await this.taskRepository.delete(id, userId, userRole);

      this.eventEmitter.emit(ACTIVITY_EVENTS.TASK_DELETED, {
        action: ACTIVITY_EVENTS.TASK_DELETED,
        userId,
        taskId: id,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}