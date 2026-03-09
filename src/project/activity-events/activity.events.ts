export const ACTIVITY_EVENTS = {
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_DELETED: 'task.deleted',
  MEMBER_INVITED: 'member.invited',
  PROJECT_CREATED: 'project.created',
  PROJECT_DELETED: 'project.deleted',
} as const;

export class ActivityEvent {
  action: string;
  userId: string;
  projectId?: string;
  taskId?: string;
}