import { MemberRole } from "../../project/enums/member.enums";
import { InviteMemberRequestDto } from '../dto/request/invite-member-request.dto';

export class InviteMemberModel {
  static fromDto(
    dto: InviteMemberRequestDto,
    projectId: string,
  ): InviteMemberModel {
    const model = new InviteMemberModel();
    model.projectId = projectId;
    model.userId = dto.userId;
    model.role = dto.role ?? MemberRole.MEMBER;
    return model;
  }

  projectId: string;
  userId: string;
  role: MemberRole;
}