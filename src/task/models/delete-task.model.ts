import { UserRole } from 'src/user/enums/user.enum';

export class DeleteTaskModel {
  static fromDto(id: string, userId: string): DeleteTaskModel {
    const model = new DeleteTaskModel();
    model.id = id;
    model.userId = userId;
    return model;
  }

  id: string;
  userId: string;
  userRole: UserRole;
}