import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectMemberRepository } from '../common/database/project-member/repositories/database-project-member.repository';
import { InviteMemberModel } from './models/invite-member.model';
import { ProjectMemberReadModel } from './models/project-member.read.model';
import { ACTIVITY_EVENTS } from '../project/activity-events/activity.events';

@Injectable()
export class ProjectMemberService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async invite(
    model: InviteMemberModel,
    invitedBy: string,
  ): Promise<ProjectMemberReadModel> {
    try {
      const member = await this.projectMemberRepository.invite(model);

      this.eventEmitter.emit(ACTIVITY_EVENTS.MEMBER_INVITED, {
        action: ACTIVITY_EVENTS.MEMBER_INVITED,
        userId: invitedBy,
        projectId: model.projectId,
      });

      return member;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to invite member');
    }
  }

  async getMembers(projectId: string): Promise<ProjectMemberReadModel[]> {
    try {
      return await this.projectMemberRepository.findAllByProject(projectId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve members');
    }
  }
}