import { Module } from '@nestjs/common';
import { ProjectMemberRepository } from './repositories/database-project-member.repository';

@Module({
  providers: [ProjectMemberRepository],
  exports: [ProjectMemberRepository],
})
export class DatabaseProjectMemberModule {}