import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from '@rt/backend/core/users/users.controller';
import { UsersService } from '@rt/backend/core/users/users.service';
import { PrismaModule } from '@rt/prisma';
import { AuthModule } from '@rt/backend/auth/auth.module';
import { StorageModule } from '@rt/backend/storage/storage.module';
import { StorageService } from '@rt/backend/storage/storage.service';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule, StorageModule],
  controllers: [UsersController],
  providers: [UsersService, StorageService],
  exports: [UsersService],
})
export class UsersModule {}
