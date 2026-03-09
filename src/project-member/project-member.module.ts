import { Module } from '@nestjs/common';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { DatabaseProjectMemberModule } from '../common/database/project-member/project-member.module';

@Module({
  imports: [DatabaseProjectMemberModule],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService],
})
export class ProjectMemberModule {}