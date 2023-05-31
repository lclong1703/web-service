import { Controller, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserDto } from './dto/user.dto';
import { Login } from './dto/login.dto';
import { Verification } from './dto/verification.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Post('login')
  async login(@Body() login: Login) {
    return await this.userService.login(login);
  }

  @Post('verification')
  verify(@Body() verification: Verification) {
    return this.userService.verify(verification);
  }

  @Post('set-password')
  setPassword(@Query('emailQ') emailQ: string, @Body() user: UserDto) {
    const email = emailQ;
    return email ? this.userService.setPassword(email, user) : '';
  }
}
