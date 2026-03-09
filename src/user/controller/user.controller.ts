import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorators';
import { UserProfileResponseDto } from '../dto/response/user-profile.response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  async getProfile(
    @CurrentUser() currentUser: { id: string },
  ): Promise<UserProfileResponseDto> {
    const user = await this.userService.findById(currentUser.id);
    return UserProfileResponseDto.fromModel(user);
  }
}