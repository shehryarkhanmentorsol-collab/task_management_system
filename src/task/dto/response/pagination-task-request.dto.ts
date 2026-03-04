import { TaskResponseDto } from './task-response.dto';

export class PaginatedTasksResponseDto {
  static fromModels(
    dtos: TaskResponseDto[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedTasksResponseDto {
    const response = new PaginatedTasksResponseDto();
    response.items = dtos;
    response.total = total;
    response.page = page;
    response.limit = limit;
    response.totalPages = Math.ceil(total / limit);
    return response;
  }

  items: TaskResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}