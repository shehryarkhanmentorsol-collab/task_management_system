import { Module } from '@nestjs/common';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  providers: [ProjectRepository],
  exports: [ProjectRepository],
})
export class DatabaseProjectModule {}