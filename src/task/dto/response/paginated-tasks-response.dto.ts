import { TaskResponseDto } from './task-response.dto';

export class PaginatedTasksResponseDto {
  static fromModels(
    items: TaskResponseDto[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedTasksResponseDto {
    const dto = new PaginatedTasksResponseDto();
    dto.items = items;
    dto.total = total;
    dto.page = page;
    dto.limit = limit;
    dto.totalPages = Math.ceil(total / limit);
    return dto;
  }

  items: TaskResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}