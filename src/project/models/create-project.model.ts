import { CreateProjectRequestDto } from "../dto/request/create-project.request.dto";

export class CreateProjectModel {
  static fromDto(dto: CreateProjectRequestDto, ownerId: string): CreateProjectModel {
    const model = new CreateProjectModel();
    model.name = dto.name;
    model.description = dto.description ?? null;
    model.ownerId = ownerId;
    return model;
  }

  name: string;
  description?: string | null;
  ownerId: string;
}