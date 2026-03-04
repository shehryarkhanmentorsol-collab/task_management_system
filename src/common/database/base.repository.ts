import { DataSource, EntityManager } from 'typeorm';

export interface IQueryOptions {
  entityManager?: EntityManager;
  relations?: string[];
}

export abstract class BaseRepository {
  constructor(protected readonly connection: DataSource) {}

  protected parseOptions(options?: IQueryOptions): IQueryOptions {
    return {
      entityManager: options?.entityManager ?? this.connection.manager,
    };
  }
}