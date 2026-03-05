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
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { UserReadModel } from 'src/user/models/user-read.model';

@Injectable()
export class UserRepository extends BaseRepository{
  constructor(
    @Inject(DATABASE_CONNECTION)  dataSource: DataSource,
  ) {
     super(dataSource);
  }

  async findById(id: string, options?: IQueryOptions): Promise<UserReadModel | null> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository(UserEntity);
    const user = await repository.findOne({ where: { id } });
    return user ? UserReadModel.fromEntity(user) : null;
  }

  async findByEmail(email: string, options?: IQueryOptions): Promise<UserEntity | null> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository(UserEntity);
    return repository.findOne({ where: { email } });
  }

  async findAll(options?: IQueryOptions): Promise<UserReadModel[]> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository(UserEntity);
    const users = await repository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      relations: ['tasks'],
    });
    return users.map((u) => UserReadModel.fromEntity(u));
  }

  async create(model: RegisterModel, options?: IQueryOptions): Promise<UserReadModel> {
    const {entityManager} = this.parseOptions(options);
    const repository = entityManager.getRepository(UserEntity);
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

      const result = await repository.save(entity);
      return result;
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