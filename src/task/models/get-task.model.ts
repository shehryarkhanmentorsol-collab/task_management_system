import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { GetTasksRequestDto } from '../dto/request/get-task-request.dto';

export class GetTasksModel {
  static fromDto(dto: GetTasksRequestDto, userId: string): GetTasksModel {
    const model = new GetTasksModel();
    model.userId = userId;
    model.status = dto.status ?? null;
    model.priority = dto.priority ?? null;
    model.page = dto.page ?? 1;
    model.limit = dto.limit ?? 10;
    return model;
  }

  userId: string;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  page: number;
  limit: number;
}