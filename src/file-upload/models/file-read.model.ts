export class FileReadModel {
  static fromEntity(entity: any): FileReadModel {
    const model = new FileReadModel();
    model.id = entity.id;
    model.fileName = entity.fileName;
    model.fileUrl = entity.fileUrl;
    model.taskId = entity.taskId;
    model.uploadedBy = entity.uploadedBy;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  fileName: string;
  fileUrl: string;
  taskId: string;
  uploadedBy: string;
  createdAt: Date;
}