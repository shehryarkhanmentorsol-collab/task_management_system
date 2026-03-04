import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { CreateTaskRequestDto } from './dto/request/create-task-request.dto';
import { UpdateTaskRequestDto } from './dto/request/update-task-request.dto';
import { GetTasksRequestDto } from './dto/request/get-task-request.dto';
import { TaskResponseDto } from './dto/response/task-response.dto';
import { PaginatedTasksResponseDto } from './dto/response/pagination-task-request.dto';
import { CreateTaskModel } from './models/create-task.model';
import { UpdateTaskModel } from './models/update-task.model';
import { GetTasksModel } from './models/get-task.model';
import { UserRole } from 'src/user/enums/user.enum';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() dto: CreateTaskRequestDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<TaskResponseDto> {
    const model = CreateTaskModel.fromDto(dto, currentUser.id);
    const task = await this.taskService.create(model);
    return TaskResponseDto.fromModel(task);
  }

  @Get()
  async findAll(
    @Query() dto: GetTasksRequestDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<PaginatedTasksResponseDto> {
    const model = GetTasksModel.fromDto(dto, currentUser.id);
    const { items, total } = await this.taskService.findAllByUser(model);
    const taskDtos = items.map((t) => TaskResponseDto.fromModel(t));
    return PaginatedTasksResponseDto.fromModels(
      taskDtos,
      total,
      model.page,
      model.limit,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.findOne(id, currentUser.id);
    return TaskResponseDto.fromModel(task);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskRequestDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<TaskResponseDto> {
    const model = UpdateTaskModel.fromDto(dto, id);
    const task = await this.taskService.update(model, currentUser.id);
    return TaskResponseDto.fromModel(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: UserRole },
  ): Promise<void> {
    await this.taskService.delete(id, currentUser.id, currentUser.role);
  }
}