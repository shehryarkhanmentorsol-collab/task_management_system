import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { RegisterModel } from '../../../../auth/models/register.model';
import { UserReadModel } from '../../../../user/models/user-read.model';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(
    id: string,
    options?: IQueryOptions,
  ): Promise<UserReadModel | null> {
    const { db } = this.parseOptions(options);
    const user = await db.user.findUnique({ where: { id } });
    return user ? UserReadModel.fromEntity(user) : null;
  }

  async findByEmail(
    email: string,
    options?: IQueryOptions,
  ): Promise<any | null> {
    const { db } = this.parseOptions(options);
    return db.user.findUnique({ where: { email } });
  }

  async findAll(options?: IQueryOptions): Promise<UserReadModel[]> {
    const { db } = this.parseOptions(options);
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return users.map((u: any) => UserReadModel.fromEntity(u));
  }

  async create(
    model: RegisterModel,
    options?: IQueryOptions,
  ): Promise<UserReadModel> {
    const { db } = this.parseOptions(options);

    try {
      const existingUser = await this.findByEmail(model.email);
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      if (!model.password) {
        throw new BadRequestException('Password is required');
      }

      const hashedPassword = await bcrypt.hash(model.password, 10);

      const result = await db.user.create({
        data: {
          name: model.name,
          email: model.email,
          password: hashedPassword,
          role: model.role,
        },
      });

      return UserReadModel.fromEntity(result);
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
    user: any,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  }
}