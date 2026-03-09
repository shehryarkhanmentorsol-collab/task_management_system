import { Module } from '@nestjs/common';
import { FileRepository } from './repositories/file-upload.repository';

@Module({
  providers: [FileRepository],
  exports: [FileRepository],
})
export class DatabaseFileModule {}