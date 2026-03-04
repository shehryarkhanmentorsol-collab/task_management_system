import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { UpdateTaskRequestDto } from '../dto/request/update-task-request.dto';

export class UpdateTaskModel {
  static fromDto(
    dto: UpdateTaskRequestDto,
    taskId: string,
  ): UpdateTaskModel {
    const model = new UpdateTaskModel();
    model.id = taskId;
    model.title = dto.title;
    model.description = dto.description;
    model.status = dto.status;
    model.priority = dto.priority;
    return model;
  }

  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}