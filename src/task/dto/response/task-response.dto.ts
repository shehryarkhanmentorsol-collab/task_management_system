import { TaskPriority, TaskStatus } from 'src/task/enums/task.enum';
import { TaskReadModel } from 'src/task/models/task-read.model';

export class TaskResponseDto {
  static fromModel(model: TaskReadModel): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.description = model.description;
    dto.status = model.status;
    dto.priority = model.priority;
    dto.userId = model.userId;
    dto.createdAt = model.createdAt;
    return dto;
  }

  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  createdAt: Date;
}