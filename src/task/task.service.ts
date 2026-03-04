import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from 'src/common/database/task/repositories/task.repository';
import { CreateTaskModel } from './models/create-task.model';
import { UpdateTaskModel } from './models/update-task.model';
import { GetTasksModel } from './models/get-task.model';
import { TaskReadModel } from './models/task-read.model';
import { UserRole } from 'src/user/enums/user.enum';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(model: CreateTaskModel): Promise<TaskReadModel> {
    try {
      const task = await this.taskRepository.create(model);
      return TaskReadModel.fromEntity(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAllByUser(
    model: GetTasksModel,
  ): Promise<{ items: TaskReadModel[]; total: number }> {
    try {
      const [tasks, total] = await this.taskRepository.findAllByUser(model);
      return {
        items: tasks.map((t) => TaskReadModel.fromEntity(t)),
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async findOne(id: string, userId: string): Promise<TaskReadModel> {
    try {
      const task = await this.taskRepository.findByIdAndUser(id, userId);
      return TaskReadModel.fromEntity(task);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve task');
    }
  }

  async update(
    model: UpdateTaskModel,
    userId: string,
  ): Promise<TaskReadModel> {
    try {
      const task = await this.taskRepository.update(model, userId);
      return TaskReadModel.fromEntity(task);
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