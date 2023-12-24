import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '@reduced.to/prisma';
import { AuthModule } from '../../auth/auth.module';
import { StorageModule } from '../../storage/storage.module';
import { StorageService } from '../../storage/storage.service';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule, StorageModule],
  controllers: [UsersController],
  providers: [UsersService, StorageService],
  exports: [UsersService],
})
export class UsersModule {}
