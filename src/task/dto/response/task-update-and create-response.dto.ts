export class TaskIdResponseDto {
  static fromEntity(id: string): TaskIdResponseDto {
    const dto = new TaskIdResponseDto();
    dto.id = id;
    return dto;
  }

  id: string;
}