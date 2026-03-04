import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DATABASE_CONNECTION } from '../../database.consts';
import { UserEntity } from '../entities/user.entity';
import { RegisterModel } from 'src/auth/models/register.model';

@Injectable()
export class UserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly dataSource: DataSource,
  ) {
    this.repository = this.dataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      relations: ['tasks'],
    });
  }

  async create(model: RegisterModel): Promise<UserEntity> {
    try {
      const existingUser = await this.findByEmail(model.email);
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      if (!model.password) {
        throw new BadRequestException('Password is required');
      }

      const hashedPassword = await bcrypt.hash(model.password, 10);

      const entity = new UserEntity();
      entity.name = model.name;
      entity.email = model.email;
      entity.password = hashedPassword;
      entity.role = model.role;

      return await this.repository.save(entity);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user', {
        cause: new Error(`Error creating user: ${(error as any)?.message}`),
      });
    }
  }

  async validatePassword(
    entity: UserEntity,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, entity.password);
  }
}