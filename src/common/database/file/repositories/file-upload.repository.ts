import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BaseRepository, IQueryOptions } from '../../base.repository';
import { FileUploadModel } from 'src/file-upload/models/file-upload.model';
import { FileReadModel } from 'src/file-upload/models/file-read.model';

@Injectable()
export class FileRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async save(
    model: FileUploadModel,
    options?: IQueryOptions,
  ): Promise<FileReadModel> {
    const { db } = this.parseOptions(options);

    try {
      const file = await db.fileAttachment.create({
        data: {
          fileUrl: model.fileUrl,
          fileName: model.fileName,
          taskId: model.taskId,
          uploadedBy: model.uploadedBy,
        },
      });
      return FileReadModel.fromEntity(file);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file attachment', {
        cause: new Error(`Error saving file: ${(error as any)?.message}`),
      });
    }
  }

  async findByTask(
    taskId: string,
    options?: IQueryOptions,
  ): Promise<FileReadModel[]> {
    const { db } = this.parseOptions(options);
    const files = await db.fileAttachment.findMany({ where: { taskId } });
    return files.map((f: any) => FileReadModel.fromEntity(f));
  }
}