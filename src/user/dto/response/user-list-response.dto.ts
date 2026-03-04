import { UserRole } from 'src/user/enums/user.enum';
import { UserReadModel } from 'src/user/models/user-read.model';

export class UserListResponseDto {
  static fromModel(model: UserReadModel): UserListResponseDto {
    const dto = new UserListResponseDto();
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