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
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { CreateTaskRequestDto } from './dto/request/create-task-request.dto';
import { UpdateTaskRequestDto } from './dto/request/update-task-request.dto';
import { GetTasksRequestDto } from './dto/request/get-task-request.dto';
import { TaskResponseDto } from './dto/response/task-response.dto';
import { PaginatedTasksResponseDto } from './dto/response/pagination-task-request.dto';
import { CreateTaskModel } from './models/create-task.model';
import { UpdateTaskModel } from './models/update-task.model';
import { GetTasksModel } from './models/get-task.model';
import { DeleteTaskModel } from './models/delete-task.model';
import { UserRole } from 'src/user/enums/user.enum';
import { TaskIdResponseDto } from './dto/response/task-update-and create-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() dto: CreateTaskRequestDto,
    @CurrentUser() currentUser,
  ): Promise<TaskIdResponseDto> {
    const model = CreateTaskModel.fromDto(dto, currentUser.id);
    const task = await this.taskService.create(model);
    return TaskIdResponseDto.fromEntity(task.id);
  }

  @Get()
  async findAll(
    @Query() dto: GetTasksRequestDto,
    @CurrentUser() currentUser,
  ): Promise<PaginatedTasksResponseDto> {
    const model = GetTasksModel.fromDto(dto, currentUser.id);
    const { items, total } = await this.taskService.findAllByUser(model);
    // why we are doing this mapping here in the controller? we can move this to the repository and make controller more clean and the repository can return TaskReadModel instead of TaskEntity and we can remove this mapping here in the controller
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
    @CurrentUser() currentUser,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.findOne(id, currentUser.id);
    return TaskResponseDto.fromModel(task);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskRequestDto,
    @CurrentUser() currentUser,
  ): Promise<TaskResponseDto> {
    const model = UpdateTaskModel.fromDto(dto, currentUser.id, id);
    const task = await this.taskService.update(model);
    return TaskResponseDto.fromModel(task);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser,
  ): Promise<{id: string}> {
    const model = DeleteTaskModel.fromDto(id, currentUser.id);
    return this.taskService.delete(model);
  }
} 