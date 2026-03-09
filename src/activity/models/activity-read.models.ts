export class ActivityReadModel {
  static fromEntity(entity: any): ActivityReadModel {
    const model = new ActivityReadModel();
    model.id = entity.id;
    model.action = entity.action;
    model.userId = entity.userId;
    model.projectId = entity.projectId;
    model.taskId = entity.taskId;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  action: string;
  userId: string;
  projectId: string | null;
  taskId: string | null;
  createdAt: Date;
}