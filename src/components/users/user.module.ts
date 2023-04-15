import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserConverter } from './converter/user.converter';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: Buffer.from(
          configService.get<string>('JWT_PRIVATE_KEY'),
          'base64',
        ).toString('ascii'),
        publicKey: Buffer.from(
          configService.get<string>('JWT_PUBLIC_KEY'),
          'base64',
        ).toString('utf8'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, UserConverter],
  controllers: [UserController],
})
export class UserModule {}
