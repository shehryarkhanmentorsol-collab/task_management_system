import { MemberRole } from "../../project/enums/member.enums";


// inthe prisma there is no entity concept so make this file for prisma perfect there is no entity usage and needed.
export class ProjectMemberReadModel {
  static fromEntity(entity: any): ProjectMemberReadModel {
    const model = new ProjectMemberReadModel();
    model.id = entity.id;
    model.projectId = entity.projectId;
    model.userId = entity.userId;
    model.role = entity.role as MemberRole;
    model.createdAt = entity.createdAt;
    model.user = entity.user ?? null;
    return model;
  }

  id: string;
  projectId: string;
  userId: string;
  role: MemberRole;
  createdAt: Date;
  user: { id: string; name: string; email: string } | null;
}