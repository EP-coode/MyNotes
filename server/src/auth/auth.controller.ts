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
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginRequest.dto';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';
import { ILoginResponse } from './interfaces/loginResponse';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginDto): Promise<ILoginResponse> {
    return await this.authService.login(user);
  }

  @Public()
  @ApiBearerAuth('jwt-refresh')
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req): Promise<ILoginResponse> {
    const { userId, refreshToken } = req.user;
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req, @GetCurrentUserId() userId: number) {
    return await this.authService.logout(userId);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    return await this.authService.registerUser(user);
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async gogleAuth(@Req() req) {}

  @Get('google/redirect')
  @Public()
  @UseGuards(AuthGuard('google'))
  async gogleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
