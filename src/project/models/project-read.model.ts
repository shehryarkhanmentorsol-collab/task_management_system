export class ProjectReadModel {
  static fromEntity(entity: any): ProjectReadModel {
    const model = new ProjectReadModel();
    model.id = entity.id;
    model.name = entity.name;
    model.description = entity.description;
    model.ownerId = entity.ownerId;
    model.createdAt = entity.createdAt;
    model.members = entity.members ?? [];
    return model;
  }

  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  members: any[];
}