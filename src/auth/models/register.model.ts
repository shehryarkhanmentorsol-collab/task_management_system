import { UserRole } from 'src/user/enums/user.enum';
import { RegisterRequestDto } from '../dto/request/register-request.dto';
import { UserEntity } from 'src/common/database/user/entities/user.entity';

export class RegisterModel {
  static fromDto(dto: RegisterRequestDto): RegisterModel {
    const model = new RegisterModel();
    model.name = dto.name;
    model.email = dto.email;
    model.password = dto.password;
    model.role = UserRole.USER;
    return model;
  }

  static fromEntity(entity: UserEntity): RegisterModel {
    const model = new RegisterModel();
    model.id = entity.id;
    model.name = entity.name;
    model.email = entity.email;
    model.role = entity.role;
    model.createdAt = entity.createdAt;
    return model;
  }

  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
}