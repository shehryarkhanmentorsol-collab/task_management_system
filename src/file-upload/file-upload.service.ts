import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from '../common/database/file/repositories/file-upload.repository';
import { FileUploadModel } from './models/file-uploads.model';
import { FileReadModel } from './models/file-read.model';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    taskId: string,
    uploadedBy: string,
  ): Promise<FileReadModel> {
    try {
      const baseUrl = this.configService.get<string>(
        'APP_URL',
        'http://localhost:3000',
      );
      const model = FileUploadModel.create(file, taskId, uploadedBy, baseUrl);
      return await this.fileRepository.save(model);
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getTaskFiles(taskId: string): Promise<FileReadModel[]> {
    try {
      return await this.fileRepository.findByTask(taskId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve files');
    }
  }
}