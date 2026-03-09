import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../common/database/user/repositories/user.repository';
import { RegisterModel } from './models/register.model';
import { LoginModel } from './models/login.model';
import { UserReadModel } from '../user/models/user-read.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(model: RegisterModel): Promise<UserReadModel> {
    try {
      return await this.userRepository.create(model);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(model: LoginModel): Promise<LoginModel> {
    try {
      const user = await this.userRepository.findByEmail(model.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.userRepository.validatePassword(
        user,
        model.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const result = new LoginModel();
      result.email = user.email;
      result.accessToken = this.jwtService.sign(payload);

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }
}