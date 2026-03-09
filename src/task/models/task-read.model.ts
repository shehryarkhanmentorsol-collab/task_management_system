import { TaskPriority, TaskStatus } from '../enums/task.enum';

// inthe prisma there is no entity concept so make this file for prisma perfect there is no entity usage and needed.

export class TaskReadModel {
  static fromEntity(entity: any): TaskReadModel {
    const model = new TaskReadModel();
    model.id = entity.id;
    model.title = entity.title;
    model.description = entity.description;
    model.status = entity.status as TaskStatus;
    model.priority = entity.priority as TaskPriority;
    model.assignedTo = entity.assignedTo;
    model.projectId = entity.projectId;
    model.dueDate = entity.dueDate;
    model.createdAt = entity.createdAt;
    return model;
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