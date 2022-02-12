import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return await this.authService.registerUser(user);
  }
}
