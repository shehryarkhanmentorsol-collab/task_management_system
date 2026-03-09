// create-task.model.ts
import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { CreateTaskRequestDto } from '../dto/request/create-task-request.dto';

export class CreateTaskModel {
  static fromDto(dto: CreateTaskRequestDto): CreateTaskModel {
    const model = new CreateTaskModel();
    model.title = dto.title;
    model.description = dto.description ?? null;
    model.status = dto.status ?? TaskStatus.TODO;
    model.priority = dto.priority ?? TaskPriority.MEDIUM;
    model.assignedTo = dto.assignedTo ?? null;
    model.projectId = dto.projectId;
    model.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    return model;
  }

  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | null;
  projectId: string;
  dueDate?: Date | null;
}