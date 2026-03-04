import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { CreateTaskRequestDto } from '../dto/request/create-task-request.dto';

export class CreateTaskModel {
  static fromDto(dto: CreateTaskRequestDto, userId: string): CreateTaskModel {
    const model = new CreateTaskModel();
    model.title = dto.title;
    model.description = dto.description ?? null;
    model.status = dto.status ?? TaskStatus.TODO;
    model.priority = dto.priority ?? TaskPriority.MEDIUM;
    model.userId = userId;
    return model;
  }

  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
}