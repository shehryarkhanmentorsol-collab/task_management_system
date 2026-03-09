import { UserRole } from "../../../common/enums/roles.enum";
import { UserReadModel } from '../../../user/models/user-read.model';

export class RegisterResponseDto {
  static fromModel(model: UserReadModel): RegisterResponseDto {
    const dto = new RegisterResponseDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.email = model.email;
    dto.role = model.role;
    dto.createdAt = model.createdAt;
    return dto;
  }

  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}