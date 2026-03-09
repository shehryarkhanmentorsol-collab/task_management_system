import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guards';
import { Roles } from '../../common/decorators/roles.decorators';
import { UserRole } from '../enums/user.enum';
import { UserListResponseDto } from '../dto/response/user-list.response.dto';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users (ADMIN only)' })
  async getAllUsers(): Promise<UserListResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((u) => UserListResponseDto.fromModel(u));
  }
}