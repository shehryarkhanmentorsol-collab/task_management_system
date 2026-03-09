import { ProjectReadModel } from "../../models/project-read.model";

export class ProjectResponseDto {
  static fromModel(model: ProjectReadModel): ProjectResponseDto {
    const dto = new ProjectResponseDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.description = model.description;
    dto.ownerId = model.ownerId;
    dto.createdAt = model.createdAt;
    dto.memberCount = model.members?.length ?? 0;
    return dto;
  }

  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  memberCount: number;
}