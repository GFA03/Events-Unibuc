import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailVerification(
    email: string,
    firstName: string,
    verificationToken: string,
  ): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${verificationToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Please verify your email address',
        template: './email-verification',
        context: {
          firstName,
          verificationUrl,
          appName: this.configService.get<string>('APP_NAME'),
        },
      });

      this.logger.log(`Email verification sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Email verification failed: ${error?.message}`,
        error?.stack,
      );
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to our platform!',
        template: './welcome',
        context: {
          firstName,
          appName: this.configService.get<string>('APP_NAME'),
          loginUrl: `${this.configService.get<string>('FRONTEND_URL')}/auth/login`,
        },
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email: ${error?.message}`,
        error?.stack,
      );
    }
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${resetToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './forgot-password',
        context: {
          firstName,
          resetUrl,
          appName: this.configService.get<string>('APP_NAME'),
        },
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Password reset email failed: ${error?.message}`,
        error?.stack,
      );
      throw error;
    }
  }
}
