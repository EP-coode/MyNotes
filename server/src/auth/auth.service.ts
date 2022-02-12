import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/loginDto';

import * as bcrypt from 'bcrypt';
import { LoginResult } from './interfaces/loginResult';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload';
import { CreateUserDto } from 'src/user/dto/createUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResult> {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return {
        succes: true,
        token: this.createToken(user),
      };
    }

    return {
      succes: false,
      errorMessage: 'email or password is wrong',
    };
  }

  async registerUser(user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }

  private createToken({ email, id }: User): string {
    const payload: JwtPayload = {
      sub: id,
      email,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }
}
