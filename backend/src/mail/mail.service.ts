import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: ISendMailOptions, context?: any) {
    return this.mailerService.sendMail({
      ...options,
      context,
    });
  }
}
