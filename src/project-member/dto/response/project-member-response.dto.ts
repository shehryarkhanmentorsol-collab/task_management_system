import { MemberRole } from "../../../project/enums/member.enums";
import { ProjectMemberReadModel } from '../../models/project-member.read.model';
export class ProjectMemberResponseDto {
  static fromModel(model: ProjectMemberReadModel): ProjectMemberResponseDto {
    const dto = new ProjectMemberResponseDto();
    dto.id = model.id;
    dto.projectId = model.projectId;
    dto.userId = model.userId;
    dto.role = model.role;
    dto.createdAt = model.createdAt;
    dto.user = model.user;
    return dto;
  }

  id: string;
  projectId: string;
  userId: string;
  role: MemberRole;
  createdAt: Date;
  user: { id: string; name: string; email: string } | null;
}