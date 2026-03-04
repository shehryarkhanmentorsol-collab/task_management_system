import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/common/database/user/repositories/user.repository';
import { UserReadModel } from './models/user-read.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserReadModel[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map((u) => UserReadModel.fromEntity(u));
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findById(id: string): Promise<UserReadModel> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return UserReadModel.fromEntity(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }
}