import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { User } from './entities/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser({ email, name, password }: CreateUserDto) {
    const result = await this.userRepository.findOne({
      where: { email },
    });

    if (result) {
      throw new HttpException(
        'User with given email already exist.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.create({
      email,
      password,
      name,
    });

    await this.userRepository.save(user);

    return user;
  }

  async findUserByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }
}
