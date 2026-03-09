import { PrismaService } from './prisma.service';

export interface IQueryOptions {
  tx?: any; // Prisma transaction client
}

export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaService) {}

  protected parseOptions(options?: IQueryOptions): { db: any } {
    return {
      db: options?.tx ?? this.prisma,
    };
  }
}