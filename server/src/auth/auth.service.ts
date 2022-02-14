import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/loginRequest.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwtPayload';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { ILoginResponse } from './interfaces/loginResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const tokens: ILoginResponse = await this.createTokens(user);
      await this.updateUserRt(user, tokens.refresh_token);
      return tokens;
    }

    throw new ForbiddenException('email or password is wrong');
  }

  async refreshTokens(userId: number, rt: string): Promise<ILoginResponse> {
    const user = await this.usersService.findUserById(userId);

    if (!user || !user.hashedRt) {
      throw new ForbiddenException();
    }

    const tokensMatch = await bcrypt.compare(rt, user.hashedRt);

    if (tokensMatch) {
      const tokens = await this.createTokens(user);
      await this.updateUserRt(user, tokens.refresh_token);
      return tokens;
    }

    throw new ForbiddenException();
  }

  async logout(userId: number): Promise<void> {
    this.userRepository.update({ id: userId }, { hashedRt: null });
  }

  async registerUser(user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }

  private async updateUserRt({ id }: User, rt: string): Promise<void> {
    // is salt necesary when rt is complex, i guess not ???
    const hash = await bcrypt.hash(rt, 10);
    await this.userRepository.update({ id: id }, { hashedRt: hash });
  }

  private async createTokens({ email, id }: User): Promise<ILoginResponse> {
    const payload: IJwtPayload = {
      sub: id,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return {
      acces_token: at,
      refresh_token: rt,
    };
  }
}
