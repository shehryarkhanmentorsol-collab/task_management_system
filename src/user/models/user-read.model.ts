import { UserRole } from '../enums/user.enum';

export class UserReadModel {
  static fromEntity(entity: any): UserReadModel {
    const model = new UserReadModel();
    model.id = entity.id;
    model.name = entity.name;
    model.email = entity.email;
    model.role = entity.role as UserRole;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}