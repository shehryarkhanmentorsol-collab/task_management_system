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
import { DeleteTaskModel } from 'src/task/models/delete-task.model';
import { UserRole } from 'src/user/enums/user.enum';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { TaskReadModel } from 'src/task/models/task-read.model';

@Injectable()
export class TaskRepository extends BaseRepository {

  constructor(
    @Inject(DATABASE_CONNECTION) dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async create(model: CreateTaskModel, options?: IQueryOptions): Promise<{id: string}> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository<TaskEntity>(TaskEntity);
    try {
      const entity = new TaskEntity();
      entity.title = model.title;
      entity.description = model.description ?? null;
      entity.status = model.status;
      entity.priority = model.priority;
      entity.userId = model.userId;

      const result = await repository.save(entity);
      return result
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task', {
        cause: new Error(`Error creating task: ${error instanceof Error ? error.message : String(error)}`),
      });
    }
  }

  async findAllByUser(model: GetTasksModel, options?: IQueryOptions): Promise<[TaskReadModel[], number]> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository<TaskEntity>(TaskEntity);

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

      const [results, count] = await repository.findAndCount({
        where,
        relations: ['user'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
      return [results.map((t) => TaskReadModel.fromEntity(t)), count];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tasks', {
        cause: new Error(`Error fetching tasks: ${error instanceof Error ? error.message : String(error)}`),
      });
    }
  }

  async findByIdAndUser(userId: string, id: string, options?: IQueryOptions): Promise<TaskReadModel> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository<TaskEntity>(TaskEntity);

    const task = await repository.findOne({ where: { userId, id } });

    if (!task) {
      // either does not exist or does not belong to this user
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(model: UpdateTaskModel, userId: string, options?: IQueryOptions): Promise<TaskReadModel> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository<TaskEntity>(TaskEntity);

    try {
      const task = await this.findByIdAndUser(model.id, userId, options);

      if (model.title !== undefined) task.title = model.title;
      if (model.description !== undefined) task.description = model.description;
      if (model.status !== undefined) task.status = model.status;
      if (model.priority !== undefined) task.priority = model.priority;

      const result = await repository.save(task);
      return result
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task', {
        cause: new Error(`Error updating task: ${error instanceof Error ? error.message : String(error)}`),
      });
    }
  }

  async delete(
    model: DeleteTaskModel,
    options?: IQueryOptions,
  ): Promise<{id: string}> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository<TaskEntity>(TaskEntity);
    const task = await repository.findOne({ where: { id: model.id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${model.id} not found`);
    }

    if (model.userRole !== UserRole.ADMIN && task.userId !== model.userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }

    try {
      await repository.remove(task);
      return { id: model.id };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete task', {
        cause: new Error(`Error deleting task: ${error instanceof Error ? error.message : String(error)}`),
      });
    }
  }
}