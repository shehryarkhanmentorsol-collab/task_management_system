import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_CONNECTION } from '../../database.consts';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskModel } from 'src/task/models/create-task.model';
import { UpdateTaskModel } from 'src/task/models/update-task.model';
import { GetTasksModel } from 'src/task/models/get-task.model';
import { UserRole } from 'src/user/enums/user.enum';

@Injectable()
export class TaskRepository {
  private readonly repository: Repository<TaskEntity>;

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly dataSource: DataSource,
  ) {
    this.repository = this.dataSource.getRepository(TaskEntity);
  }

  async create(model: CreateTaskModel): Promise<TaskEntity> {
    try {
      const entity = new TaskEntity();
      entity.title = model.title;
      entity.description = model.description ?? null;
      entity.status = model.status;
      entity.priority = model.priority;
      entity.userId = model.userId;

      return await this.repository.save(entity);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task', {
        cause: new Error(`Error creating task: ${(error as any)?.message}`),
      });
    }
  }

  async findAllByUser(model: GetTasksModel): Promise<[TaskEntity[], number]> {
    try {
      const { userId, status, priority, page, limit } = model;
      const skip = (page - 1) * limit;

      const where: any = { userId };
      
      if (status) {
        where.status = status;
      }

      if (priority) {
        where.priority = priority;
      }

      return await this.repository.findAndCount({
        where,
        relations: ['user'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tasks', {
        cause: new Error(`Error fetching tasks: ${(error as any)?.message}`),
      });
    }
  }

  async findByIdAndUser(id: string, userId: string): Promise<TaskEntity> {
    const task = await this.repository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async update(model: UpdateTaskModel, userId: string): Promise<TaskEntity> {
    try {
      const task = await this.findByIdAndUser(model.id, userId);

      if (model.title !== undefined) task.title = model.title;
      if (model.description !== undefined) task.description = model.description;
      if (model.status !== undefined) task.status = model.status;
      if (model.priority !== undefined) task.priority = model.priority;

      return await this.repository.save(task);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task', {
        cause: new Error(`Error updating task: ${(error as any)?.message}`),
      });
    }
  }

  async delete(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<void> {
    const task = await this.repository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (userRole !== UserRole.ADMIN && task.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }

    try {
      await this.repository.remove(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete task', {
        cause: new Error(`Error deleting task: ${(error as any)?.message}`),
      });
    }
  }
}