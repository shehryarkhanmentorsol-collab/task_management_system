import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/user/enums/user.enum';

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
