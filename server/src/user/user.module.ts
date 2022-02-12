import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
