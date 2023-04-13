import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserConverter } from './converter/user.converter';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserConverter],
  controllers: [UserController],
})
export class UserModule {}
