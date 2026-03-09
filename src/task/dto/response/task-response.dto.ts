import { TaskPriority, TaskStatus } from "../../enums/task.enum";
import { TaskReadModel } from '../../models/task-read.model';

export class TaskResponseDto {
  static fromModel(model: TaskReadModel): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.description = model.description;
    dto.status = model.status;
    dto.priority = model.priority;
    dto.assignedTo = model.assignedTo;
    dto.projectId = model.projectId;
    dto.dueDate = model.dueDate;
    dto.createdAt = model.createdAt;
    return dto;
  }

  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string | null;
  projectId: string;
  dueDate: Date | null;
  createdAt: Date;
}