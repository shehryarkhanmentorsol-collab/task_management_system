import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { UserProfileResponseDto } from '../dto/response/user-profile-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @CurrentUser() currentUser: { id: string },
  ): Promise<UserProfileResponseDto> {
    const user = await this.userService.findById(currentUser.id);
    return UserProfileResponseDto.fromModel(user);
  }
}