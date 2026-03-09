import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityListener } from './listeners/activity.listener';
import { DatabaseActivityModule } from '../common/database/activity/database-activity.module';

@Module({
  imports: [DatabaseActivityModule],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityListener],
})
export class ActivityModule {}