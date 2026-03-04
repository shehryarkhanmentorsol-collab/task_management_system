import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from './database.consts';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST') || 'localhost';
        const port = parseInt(configService.get<string>('DB_PORT') || '3306', 10);
        const username = configService.get<string>('DB_USERNAME') || 'mysql';
        const password = configService.get<string>('DB_PASSWORD') ?? '';
        const database = configService.get<string>('DB_NAME') || configService.get<string>('DB_DATABASE') || 'mysql';
        const synchronizeEnv = configService.get<string>('DB_SYNCHRONIZE');
        const loggingEnv = configService.get<string>('DB_LOGGING');

        console.log('Initializing MySQL connection', { host, port, username, database, synchronize: synchronizeEnv });
        const dataSource = new DataSource({
          type: 'mysql',
          host,
          port: port || 3306,
          username,
          password,
          database: database || 'task_management_system',
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../../db/migrations/*.ts'],
          synchronize: synchronizeEnv ? synchronizeEnv === 'true' : true,
          logging: loggingEnv === 'true',
        });

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseConnectionModule {}

export const DatabaseModule = DatabaseConnectionModule;