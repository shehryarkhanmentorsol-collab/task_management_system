import { UserRole } from "../../user/enums/user.enum";
import { RegisterRequestDto } from '../dto/request/register-request.dto';

export class RegisterModel {
  static fromDto(dto: RegisterRequestDto): RegisterModel {
    const model = new RegisterModel();
    model.name = dto.name;
    model.email = dto.email;
    model.password = dto.password;
    model.role = UserRole.USER; 
    return model;
  }

  name: string;
  email: string;
  password?: string;
  role: UserRole;
}