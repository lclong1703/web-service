import { Controller, Post, Body, Req, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserDto } from './dto/user.dto';
import { Login } from './dto/login.dto';
import { Verification } from './dto/verification.dto';
import { Request } from 'express';

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

  @Patch('set-password')
  setPassword(@Req() request: Request, @Body() user: UserDto) {
    const email = request.get('email');
    return email ? this.userService.setPassword(email, user) : '';
  }
}
