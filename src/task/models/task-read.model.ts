import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { TaskEntity } from 'src/common/database/task/entities/task.entity';

export class TaskReadModel {
  static fromEntity(entity: TaskEntity): TaskReadModel {
    const model = new TaskReadModel();
    model.id = entity.id;
    model.title = entity.title;
    model.description = entity.description;
    model.status = entity.status;
    model.priority = entity.priority;
    model.userId = entity.userId;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  createdAt: Date;
}