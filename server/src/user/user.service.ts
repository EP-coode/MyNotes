import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createUser(
    { email, name, password }: CreateUserDto,
    confirmationToken: string,
  ): Promise<User> {
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
      emailConfirmed: false,
      confirmationToken,
    });

    await Promise.all([
      this.userRepository.save(user),
      this.mailService.sendUserConfirmation(user, confirmationToken),
    ]);

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = this.userRepository.findOne({ where: { id } });
    return user;
  }
}
