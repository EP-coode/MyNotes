import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `localhost:7000/auth/email-confirm?token=${token}&email=${user.email}`;

    this.mailService.sendMail({
      to: user.email,
      subject: 'Welcome to MyNotes app. Please confirm your email',
      template: 'confirmation',
      context: {
        username: user.name,
        url: url,
      },
    });

    //throw new NotImplementedException();
  }
}
