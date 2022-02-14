import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginRequest.dto';
import { RtGuard } from './guards/rt.guard';
import { ILoginResponse } from './interfaces/loginResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginDto): Promise<ILoginResponse> {
    return await this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Req() req): Promise<ILoginResponse> {
    const { userId, refreshToken } = req.user;
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AuthGuard('jwt-acces'))
  @Post('logout')
  async logout(@Req() req) {
    const { userId } = req.user;
    return await this.authService.logout(userId);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    return await this.authService.registerUser(user);
  }
}
