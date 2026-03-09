import { Module } from '@nestjs/common';
import { TaskController } from './task-controller';
import { TaskService } from './task.service';
import { DatabaseTaskModule } from '../common/database/task/repositories/database-task.module';

@Module({
  imports: [DatabaseTaskModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}