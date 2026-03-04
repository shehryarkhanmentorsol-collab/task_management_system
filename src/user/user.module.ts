import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { AdminUserController } from './controller/admin-user.controller';
import { UserService } from './user.service';
import { DatabaseUserModule } from 'src/common/database/user/database-user.module';

@Module({
  imports: [DatabaseUserModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}