import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorators";
import { CreateProjectRequestDto } from "./dto/request/create-project.request.dto";
import { ProjectResponseDto } from "./dto/response/project-response.dto";
import { CreateProjectModel } from "./models/create-project.model";

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController{
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    async createProject(@Body() dto: CreateProjectRequestDto,
    @CurrentUser() CurrentUser: {id: string}): Promise<ProjectResponseDto> {
    
        const model = CreateProjectModel.fromDto(dto, CurrentUser.id);
        const project = await this.projectService.createProject(model);
        return ProjectResponseDto.fromModel(project);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects' })
    async findAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectService.findAll();
    // dont map it here just return and map it in the service layer.
    return projects.map((p) => ProjectResponseDto.fromModel(p));
    }
    
    @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    const project = await this.projectService.findById(id);
    return ProjectResponseDto.fromModel(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project (owner only)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<void> {
    await this.projectService.delete(id, currentUser.id);
  }
}