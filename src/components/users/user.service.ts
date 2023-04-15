import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User as UserDto } from './dto/user.dto';
import { Status, User } from './entity/user.entity';
import { UserConverter } from './converter/user.converter';
import { Login } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Verification } from './dto/verification.dto';
import generateApiKey from 'generate-api-key';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userConverter: UserConverter,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private readonly privateKey = Buffer.from(
    this.configService.get<string>('JWT_PRIVATE_KEY'),
    'base64',
  ).toString('ascii');

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async createUser(userDto: UserDto): Promise<UserDto> {
    const userRepository = this.dataSource.manager.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: userDto.email },
    });
    if (user && user.status !== Status.INACTIVE)
      throw new ConflictException(`${userDto.email} is existed`);
    const newUserEntity = user || this.userConverter.toEntity(userDto);
    const randomKey = generateApiKey({
      method: 'string',
      dashes: false,
      length: 6,
      pool: '0123456789',
    });
    newUserEntity.key = randomKey.toString();
    const date = new Date();
    date.setMinutes(date.getMinutes() + 3);
    newUserEntity.expireCode = date;
    const savedUser = await userRepository.save(newUserEntity);
    this.sendMail(savedUser.email, randomKey.toString());
    return this.userConverter.toDto(savedUser);
  }

  private async sendMail(email: string, randomKey: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Xác minh tài khoản',
      template: './email',
      context: {
        randomKey: randomKey,
      },
    });
  }

  async verify(verification: Verification) {
    const userRepository = this.dataSource.manager.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email: verification.email,
        key: verification.key,
      },
    });
    if (!user) throw new BadRequestException('email or key wrong');
    if (user && user.expireCode < new Date())
      throw new UnauthorizedException('key is expired');
    user.key = null;
    const updateUser = await userRepository.save(user);
    return this.userConverter.toDto(updateUser);
  }

  async setPassword(email: string, userDto: UserDto) {
    const userRepository = this.dataSource.manager.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: email, key: null },
    });
    if (!user) throw new NotFoundException(`User ${email} not found`);
    if (user && user.status !== Status.INACTIVE) throw new ForbiddenException();
    user.name = userDto.name; //to do information
    user.password = await this.hashPassword(userDto.password);
    user.status = Status.ACTIVE;
    user.expireCode = null;
    const updateUser = await userRepository.save(user);
    return this.userConverter.toDto(updateUser);
  }

  private async issueAccessToken(user: User): Promise<Login> {
    const userDto = this.userConverter.toDto(user);
    return {
      access_token: this.jwtService.sign(
        { user: userDto },
        {
          privateKey: this.privateKey,
          algorithm: 'RS256',
          expiresIn: '1h',
        },
      ),
    } as Login;
  }

  async login(login: Login) {
    const userRepository = this.dataSource.manager.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email: login.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('invalid user');
    }
    const passwordCompare = await bcrypt.compare(login.password, user.password);
    if (!passwordCompare) {
      throw new UnauthorizedException('invalid password');
    }
    return await this.issueAccessToken(user);
  }
}
