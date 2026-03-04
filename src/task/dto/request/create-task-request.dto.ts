import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from 'src/task/enums/task.enum';

export class CreateTaskRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}