import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = 'some url';

    this.mailService.sendMail({
      to: user.email,
      subject: 'Witaj w aplikacji MyNotes. Ptwierdz swoje konto',
      template: 'confirmation',
      context: {
        username: user.name,
        url: url,
      },
    });

    //throw new NotImplementedException();
  }
}
