export class FileUploadModel {
  static create(
    file: Express.Multer.File,
    taskId: string,
    uploadedBy: string,
    baseUrl: string,
  ): FileUploadModel {
    const model = new FileUploadModel();
    model.fileName = file.originalname;
    model.fileUrl = `${baseUrl}/uploads/${file.filename}`;
    model.taskId = taskId;
    model.uploadedBy = uploadedBy;
    return model;
  }

  fileName: string;
  fileUrl: string;
  taskId: string;
  uploadedBy: string;
}