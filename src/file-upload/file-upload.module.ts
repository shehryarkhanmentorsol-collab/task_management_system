import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { DatabaseFileModule } from '../common/database/file/database-file.upload';

@Module({
  imports: [DatabaseFileModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}