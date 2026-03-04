import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from '../enums/user.enum';
import { UserListResponseDto } from '../dto/response/user-list-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUsers(): Promise<UserListResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((u) => UserListResponseDto.fromModel(u));
  }
}