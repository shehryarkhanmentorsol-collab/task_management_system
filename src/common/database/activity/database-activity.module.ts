import { Module } from '@nestjs/common';
import { ActivityRepository } from './repositories/activity.repository';

@Module({
  providers: [ActivityRepository],
  exports: [ActivityRepository],
})
export class DatabaseActivityModule {}