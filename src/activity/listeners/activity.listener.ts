import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityRepository } from '../../common/database/activity/repositories/activity.repository';
import { ACTIVITY_EVENTS, ActivityEvent } from '../../project/activity-events/activity.events';

@Injectable()
export class ActivityListener {
  constructor(private readonly activityRepository: ActivityRepository) {}

  @OnEvent(ACTIVITY_EVENTS.TASK_CREATED)
  async handleTaskCreated(event: ActivityEvent) {
    await this.activityRepository.create(event);
  }

  @OnEvent(ACTIVITY_EVENTS.TASK_UPDATED)
  async handleTaskUpdated(event: ActivityEvent) {
    await this.activityRepository.create(event);
  }

  @OnEvent(ACTIVITY_EVENTS.TASK_DELETED)
  async handleTaskDeleted(event: ActivityEvent) {
    await this.activityRepository.create(event);
  }

  @OnEvent(ACTIVITY_EVENTS.MEMBER_INVITED)
  async handleMemberInvited(event: ActivityEvent) {
    await this.activityRepository.create(event);
  }

  @OnEvent(ACTIVITY_EVENTS.PROJECT_CREATED)
  async handleProjectCreated(event: ActivityEvent) {
    await this.activityRepository.create(event);
  }

  @OnEvent(ACTIVITY_EVENTS.PROJECT_DELETED)
  async handleProjectDeleted(event: ActivityEvent) {
    await this.activityRepository.create(event);
  }
}