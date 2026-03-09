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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorators';
import { CreateTaskRequestDto } from './dto/request/create-task-request.dto';
import { UpdateTaskRequestDto } from './dto/request/update-task-request.dto';
import { GetTasksRequestDto } from './dto/request/get-task-request.dto';
import { TaskResponseDto } from './dto/response/task-response.dto';
import { PaginatedTasksResponseDto } from './dto/response/paginated-tasks-response.dto';
import { CreateTaskModel } from './models/create-task.model';
import { UpdateTaskModel } from './models/update-task.model';
import { GetTasksModel } from './models/get-task.model';
import { UserRole } from '../user/enums/user.enum';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task in a project' })
  async create(
    @Body() dto: CreateTaskRequestDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<TaskResponseDto> {
    const model = CreateTaskModel.fromDto(dto);
    const task = await this.taskService.create(model, currentUser.id);
    return TaskResponseDto.fromModel(task);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks with filters and pagination' })
  async findAll(
    @Query() dto: GetTasksRequestDto,
  ): Promise<PaginatedTasksResponseDto> {
    const model = GetTasksModel.fromDto(dto);
    const { items, total } = await this.taskService.findAll(model);

    // we dont map it here just return and map it in the service layer.
    const taskDtos = items.map((t) => TaskResponseDto.fromModel(t));
    return PaginatedTasksResponseDto.fromModels(taskDtos, total, model.page, model.limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskRequestDto,
    @CurrentUser() currentUser: { id: string; role: UserRole },
  ): Promise<TaskResponseDto> {
    const model = UpdateTaskModel.fromDto(dto, id);
    const task = await this.taskService.update(model, currentUser.id, currentUser.role);
    return TaskResponseDto.fromModel(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task (ADMIN or assignee)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: UserRole },
  ): Promise<void> {
    await this.taskService.delete(id, currentUser.id, currentUser.role);
  }
}