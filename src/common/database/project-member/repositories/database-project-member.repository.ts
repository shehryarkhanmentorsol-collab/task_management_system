import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { InviteMemberModel } from '../../../../project-member/models/invite-member.model';
import { ProjectMemberReadModel } from '../../../../project-member/models/project-member.read.model';
import { BaseRepository, IQueryOptions } from '../../base.repository';

@Injectable()
export class ProjectMemberRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async invite(
    model: InviteMemberModel,
    options?: IQueryOptions,
  ): Promise<ProjectMemberReadModel> {
    const { db } = this.parseOptions(options);

    try {
      const project = await db.project.findUnique({ where: { id: model.projectId } });
      if (!project) {
        throw new NotFoundException(`Project with id ${model.projectId} not found`);
      }

      const user = await db.user.findUnique({ where: { id: model.userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${model.userId} not found`);
      }

      const existing = await db.projectMember.findUnique({
        where: { projectId_userId: { projectId: model.projectId, userId: model.userId } },
      });
      if (existing) {
        throw new BadRequestException('User is already a member of this project');
      }

      const member = await db.projectMember.create({
        data: {
          projectId: model.projectId,
          userId: model.userId,
          role: model.role,
        },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      return ProjectMemberReadModel.fromEntity(member);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to invite member', {
        cause: new Error(`Error inviting member: ${(error as any)?.message}`),
      });
    }
  }

  async findAllByProject(
    projectId: string,
    options?: IQueryOptions,
  ): Promise<ProjectMemberReadModel[]> {
    const { db } = this.parseOptions(options);
    const members = await db.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return members.map((m: any) => ProjectMemberReadModel.fromEntity(m));
  }
}