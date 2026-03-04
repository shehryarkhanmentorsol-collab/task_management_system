import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [DatabaseModule],
  providers: [TaskRepository],
  exports: [TaskRepository],
})
export class DatabaseTaskModule {}