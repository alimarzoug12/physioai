import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('mail.host'),
      port: this.config.get('mail.port'),
      secure: false,
      auth: {
        user: this.config.get('mail.user'),
        pass: this.config.get('mail.pass'),
      },
    });
  }

  async sendVerificationEmail(to: string, fullName: string, token: string) {
    const appUrl = this.config.get('app.url');
    const link = `${appUrl}/verify-email?token=${token}`;

    await this.send(to, 'Verify your PhysioAI account', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Welcome to PhysioAI, ${fullName}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${link}"
           style="display:inline-block; background:#3b82f6; color:white;
                  padding:12px 24px; border-radius:8px; text-decoration:none;
                  font-weight:bold; margin:16px 0;">
          Verify Email Address
        </a>
        <p style="color:#6b7280; font-size:14px;">
          This link expires in 24 hours.<br/>
          If you did not create an account, ignore this email.
        </p>
        <p style="color:#6b7280; font-size:12px;">
          Or copy this link: ${link}
        </p>
      </div>
    `);
  }

  async sendPasswordResetEmail(to: string, fullName: string, token: string) {
    const appUrl = this.config.get('app.url');
    const link = `${appUrl}/reset-password?token=${token}`;

    await this.send(to, 'Reset your PhysioAI password', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Password Reset Request</h2>
        <p>Hi ${fullName}, we received a request to reset your password.</p>
        <a href="${link}"
           style="display:inline-block; background:#ef4444; color:white;
                  padding:12px 24px; border-radius:8px; text-decoration:none;
                  font-weight:bold; margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#6b7280; font-size:14px;">
          This link expires in 1 hour.<br/>
          If you did not request this, ignore this email — your password will not change.
        </p>
        <p style="color:#6b7280; font-size:12px;">
          Or copy this link: ${link}
        </p>
      </div>
    `);
  }

  async sendBookingConfirmation(
    to: string, fullName: string,
    doctorName: string, date: string, time: string,
  ) {
    await this.send(to, 'Booking Confirmed — PhysioAI', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Booking Confirmed ✓</h2>
        <p>Hi ${fullName}, your session has been confirmed.</p>
        <div style="background:#f0f9ff; border-radius:8px; padding:16px; margin:16px 0;">
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p style="color:#6b7280; font-size:14px;">
          You can manage your bookings in the PhysioAI app.
        </p>
      </div>
    `);
  }

  private async send(to: string, subject: string, html: string) {
    // In dev with no mail config, just log instead of crashing
    if (!this.config.get('mail.user') || this.config.get('mail.user') === 'your@gmail.com') {
      this.logger.warn(`[DEV] Email not sent (no mail config). Would send to: ${to}`);
      this.logger.warn(`[DEV] Subject: ${subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.config.get('mail.from'),
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}:`, err);
      // Don't throw — email failure should never break an API response
    }
  }
}