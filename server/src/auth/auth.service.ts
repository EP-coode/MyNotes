import {
  ForbiddenException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/loginRequest.dto';

// maybe use argon2 instead ???
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwtPayload';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { ILoginResponse } from './interfaces/loginResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterResult } from './interfaces/registerResult';
import { getRandomString } from 'src/common/helpers/random';

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

    const tokensMatch = await this.validateUserRefreshToken(user, rt);

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

  async registerUser(user: CreateUserDto): Promise<RegisterResult> {
    const { id, email, emailConfirmed, name } =
      await this.usersService.createUser(user);
    return {
      id,
      email,
      emailConfirmed,
      name,
    };
  }

  private async validateUserRefreshToken({ hashedRt }: User, rt: string) {
    const hrt = createHash('sha256').update(rt).digest('hex');
    return await bcrypt.compare(hrt, hashedRt);
  }

  private async updateUserRt({ id }: User, rt: string): Promise<void> {
    // is salt necesary when rt is complex, i guess not ???
    const hrt = createHash('sha256').update(rt).digest('hex');
    const hash = await bcrypt.hash(hrt, 10);
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

  async googleLogin(req: any) {
    throw new NotImplementedException();
  }
}
