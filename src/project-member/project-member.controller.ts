import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectMemberService } from './project-member.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorators';
import { InviteMemberRequestDto } from './dto/request/invite-member-request.dto';
import { ProjectMemberResponseDto } from './dto/response/project-member-response.dto';
import { InviteMemberModel } from './models/invite-member.model';

@ApiTags('Project Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:id/members')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Post('invite')
  @ApiOperation({ summary: 'Invite a user to a project' })
  async invite(
    @Param('id') projectId: string,
    @Body() dto: InviteMemberRequestDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<ProjectMemberResponseDto> {
    const model = InviteMemberModel.fromDto(dto, projectId);
    const member = await this.projectMemberService.invite(model, currentUser.id);
    return ProjectMemberResponseDto.fromModel(member);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members of a project' })
  async getMembers(
    @Param('id') projectId: string,
  ): Promise<ProjectMemberResponseDto[]> {
    const members = await this.projectMemberService.getMembers(projectId);
    
    // dont map it here just return and map it in the service layer.
    return members.map((m) => ProjectMemberResponseDto.fromModel(m));
  }
}