import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from '../guard/auth/local-auth.guard';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return { msg: 'Logged in!' }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('info')
  getUsers(@Request() req) {
    return {
      data: req.user
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Request() req) {
    req.logout(() => {
      return;
    });
  }

}
