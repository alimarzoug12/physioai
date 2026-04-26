import {
  Injectable, UnauthorizedException, BadRequestException,
  ConflictException, NotFoundException, Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import type { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtSvc: JwtService,
    private config: ConfigService,
  ) { }

  // ─────────────────────────────────────────────────────────────────
  // MAILER — built inline, no separate MailService needed
  // ─────────────────────────────────────────────────────────────────

  private createTransporter() {
    const host = this.config.get<string>('smtp.host');
    const port = this.config.get<number>('smtp.port');
    const user = this.config.get<string>('smtp.user');
    const pass = this.config.get<string>('smtp.pass');

    this.logger.debug(`Creating SMTP transporter: ${host}:${port} user=${user}`);

    return nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }, // needed for dev
    });
  }

  private async sendMail(to: string, subject: string, html: string): Promise<void> {
    const user = this.config.get<string>('smtp.user');
    const from = this.config.get<string>('smtp.from') || `PhysioAI <${user}>`;

    // In dev: if SMTP not configured, just log
    if (!user || user === 'your@gmail.com') {
      this.logger.warn(`[DEV - NO SMTP] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      const transporter = this.createTransporter();
      const info = await transporter.sendMail({ from, to, subject, html });
      this.logger.log(`✅ Email sent to ${to} — messageId: ${info.messageId}`);
    } catch (err: any) {
      this.logger.error(`❌ Email FAILED to ${to}: ${err.message}`);
      // Don't throw — email failure should never break the API
    }
  }

  private async sendVerificationCodeEmail(
    to: string, fullName: string, code: string,
  ): Promise<void> {
    await this.sendMail(
      to,
      'Your Physio AI verification code',
      `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;
                  border:1px solid #e5e7eb;border-radius:16px;">
        <h1 style="color:#3b82f6;margin:0 0 20px;">Physio AI</h1>
        <h2 style="color:#1f2937;">Welcome, ${fullName}! 👋</h2>
        <p style="font-size:16px;color:#6b7280;">
          Use the code below to verify your email address.
          It expires in <strong>15 minutes</strong>.
        </p>
        <div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:16px;
                    padding:32px;text-align:center;margin:24px 0;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:14px;text-transform:uppercase;
                    letter-spacing:2px;">Verification Code</p>
          <span style="font-size:52px;font-weight:900;letter-spacing:14px;color:#1d4ed8;
                       font-family:monospace;">${code}</span>
        </div>
        <p style="font-size:13px;color:#9ca3af;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
      `,
    );
  }

  private async sendPasswordResetEmail(
    to: string, fullName: string, token: string,
  ): Promise<void> {
    const frontendUrl = this.config.get<string>('app.frontendUrl') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.sendMail(
      to,
      'Reset your Physio AI password',
      `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;
                  border:1px solid #e5e7eb;border-radius:16px;">
        <h1 style="color:#3b82f6;margin:0 0 20px;">Physio AI</h1>
        <h2 style="color:#1f2937;">Password Reset 🔑</h2>
        <p style="font-size:16px;color:#6b7280;">
          Hi <strong>${fullName}</strong>, click the button below to reset your password.
          This link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}"
             style="background:#3b82f6;color:#fff;padding:16px 40px;border-radius:12px;
                    text-decoration:none;font-size:18px;font-weight:700;
                    display:inline-block;">
            Reset My Password
          </a>
        </div>
        <p style="font-size:13px;color:#9ca3af;">
          Or paste this URL in your browser:<br/>
          <a href="${resetUrl}" style="color:#3b82f6;word-break:break-all;">${resetUrl}</a>
        </p>
        <p style="font-size:13px;color:#9ca3af;">
          If you didn't request this, ignore this email — your password won't change.
        </p>
      </div>
      `,
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // TOKEN HELPERS
  // ─────────────────────────────────────────────────────────────────

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateCode(): string {
    // 6-digit code, zero-padded
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private generateAccessToken(userId: string, role: string): string {
    return this.jwtSvc.sign({ userId, role });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const rawToken = this.generateSecureToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return rawToken;
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    // ✅ path:'/' so cookie is sent on ALL requests, not just /auth/refresh
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',   // 'lax' works better in dev than 'strict'
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',     // ✅ FIXED: was '/auth/refresh' which blocked the cookie
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refresh_token', { path: '/' });
  }

  private userResponse(user: {
    id: string; email: string; fullName: string;
    role: string; emailVerified: boolean;
  }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        provider: 'email',
        emailVerified: false,
        verificationCode: code,
        verificationExpiresAt: expiresAt,
        ...(dto.healthProfile ? {
          healthProfile: {
            create: {
              age: dto.healthProfile.age,
              gender: dto.healthProfile.gender,
              backPain: dto.healthProfile.backPain ?? false,
              jointPain: dto.healthProfile.jointPain ?? false,
              sportsInjury: dto.healthProfile.sportsInjury ?? false,
              neckIssues: dto.healthProfile.neckIssues ?? false,
              activityLevel: dto.healthProfile.activityLevel,
            },
          },
        } : {}),
      },
    });

    this.logger.log(`New user registered: ${user.email}`);

    // Send verification code — fire and forget
    this.sendVerificationCodeEmail(user.email, user.fullName, code)
      .catch(err => this.logger.error('Failed to send verification email', err?.message));

    // Return pending — frontend shows verification modal
    return {
      pending: true,
      email: user.email,
      message: 'Account created! Check your email for a 6-digit code.',
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // VERIFY EMAIL  (6-digit code flow)
  // ─────────────────────────────────────────────────────────────────

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.emailVerified) {
      return { verified: true, message: 'Email is already verified. Please log in.' };
    }
    if (
      !user.verificationCode ||
      user.verificationCode !== code.trim() ||
      !user.verificationExpiresAt ||
      user.verificationExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpiresAt: null,
      },
    });

    this.logger.log(`Email verified: ${email}`);
    return { verified: true, message: 'Email verified! You can now log in.' };
  }

  // ─────────────────────────────────────────────────────────────────
  // RESEND VERIFICATION CODE
  // ─────────────────────────────────────────────────────────────────

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    if (user.emailVerified) throw new BadRequestException('Email is already verified');

    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { verificationCode: code, verificationExpiresAt: expiresAt },
    });

    await this.sendVerificationCodeEmail(email, user.fullName, code);
    this.logger.log(`Verification code resent to: ${email}`);

    return { message: 'New verification code sent. Check your inbox.' };
  }

  // ─────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Constant-time comparison even on user-not-found
    const passwordValid = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : (await bcrypt.compare(dto.password, '$2a$12$abcdefghijklmnopqrstuvwxyz012345'), false);

    if (!user || !passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // OAuth-only account
    if (user.provider !== 'email' && !user.passwordHash) {
      throw new UnauthorizedException(
        `This account uses ${user.provider} login. Please sign in with ${user.provider}.`,
      );
    }

    // Email not verified — resend code and tell frontend to show modal
    if (!user.emailVerified) {
      const code      = this.generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await this.prisma.user.update({
        where: { email: dto.email },
        data:  { verificationCode: code, verificationExpiresAt: expiresAt },
      });

      this.sendVerificationCodeEmail(user.email, user.fullName, code).catch(() => {});

      // Use a structured error so the frontend can detect it
      throw new UnauthorizedException(
        JSON.stringify({
          code:    'EMAIL_NOT_VERIFIED',
          email:   user.email,
          message: 'Please verify your email. A new code has been sent.',
        }),
      );
    }
    // if (!user.emailVerified) {
    //   // Instead of hard-blocking, resend code and return special error
    //   // so frontend can show verification modal
    //   const code = this.generateCode();
    //   const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    //   await this.prisma.user.update({
    //     where: { email: dto.email },
    //     data: { verificationCode: code, verificationExpiresAt: expiresAt },
    //   });
    //   this.sendVerificationEmail(user.email, user.fullName, code).catch(() => { });

    //   throw new UnauthorizedException(
    //     JSON.stringify({
    //       code: 'EMAIL_NOT_VERIFIED',
    //       email: user.email,
    //       message: 'Please verify your email. A new code has been sent.',
    //     }),
    //   );
    // }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = await this.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(res, refreshToken);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      accessToken,
      user: this.userResponse(user),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // REFRESH TOKEN
  // ─────────────────────────────────────────────────────────────────

  async refresh(req: Request, res: Response) {
    const rawToken: string | undefined = (req as any).cookies?.['refresh_token'];

    if (!rawToken) {
      throw new UnauthorizedException('No refresh token — please log in again');
    }

    const tokenHash = this.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Token reuse detection
    if (stored?.revokedAt) {
      this.logger.warn(`Refresh token reuse detected for userId: ${stored.userId}`);
      await this.prisma.refreshToken.updateMany({
        where: { userId: stored.userId },
        data: { revokedAt: new Date() },
      });
      this.clearRefreshTokenCookie(res);
      throw new UnauthorizedException('Security alert: please log in again');
    }

    if (!stored || stored.expiresAt < new Date()) {
      this.clearRefreshTokenCookie(res);
      throw new UnauthorizedException('Session expired — please log in again');
    }

    // Rotate
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const accessToken = this.generateAccessToken(stored.userId, stored.user.role);
    const newRefreshToken = await this.generateRefreshToken(stored.userId);
    this.setRefreshTokenCookie(res, newRefreshToken);

    return { accessToken, user: this.userResponse(stored.user) };
  }

  // ─────────────────────────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────────────────────────

  async logout(req: Request, res: Response) {
    const rawToken: string | undefined = (req as any).cookies?.['refresh_token'];

    if (rawToken) {
      const tokenHash = this.hashToken(rawToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revokedAt: new Date() },
      }).catch(() => { });
    }

    this.clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string, res: Response) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    this.clearRefreshTokenCookie(res);
    return { message: 'Logged out from all devices' };
  }

  // ─────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const safeMsg = {
      message: 'If an account with that email exists, a reset link has been sent.',
    };

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return safeMsg;
    if (user.provider !== 'email') return safeMsg; // OAuth accounts can't reset password

    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiresAt: expiresAt },
    });

    await this.sendPasswordResetEmail(email, user.fullName, token);
    this.logger.log(`Password reset email sent to: ${email}`);

    return safeMsg;
  }

  // ─────────────────────────────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────────────────────────────

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset link');
    }
    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Reset link has expired. Please request a new one.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    // Revoke all refresh tokens — force re-login everywhere
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    }).catch(() => { });

    this.logger.log(`Password reset for: ${user.email}`);
    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ─────────────────────────────────────────────────────────────────
  // GET CURRENT USER
  // ─────────────────────────────────────────────────────────────────

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, fullName: true, phone: true,
        role: true, emailVerified: true, provider: true, createdAt: true,
        healthProfile: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ─────────────────────────────────────────────────────────────────
  // OAUTH — shared
  // ─────────────────────────────────────────────────────────────────

  private async findOrCreateOAuthUser(
    email: string, fullName: string, provider: string, res: Response,
  ) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email, fullName,
          passwordHash: '',
          provider,
          emailVerified: true,
        },
      });
      this.logger.log(`New OAuth user: ${email} via ${provider}`);
    } else if (!user.emailVerified) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
      user = { ...user, emailVerified: true };
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = await this.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken, user: this.userResponse(user) };
  }

  async googleAuth(accessToken: string, res: Response) {
    try {
      const { data } = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!data?.email) throw new UnauthorizedException('Google did not return an email');
      return this.findOrCreateOAuthUser(data.email, data.name || data.email, 'google', res);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async facebookAuth(accessToken: string, res: Response) {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
      );
      if (!data?.email) throw new UnauthorizedException('Facebook did not provide an email');
      return this.findOrCreateOAuthUser(data.email, data.name, 'facebook', res);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }

  async appleAuth(identityToken: string, fullName: string | undefined, res: Response) {
    try {
      const client = new JwksClient({ jwksUri: 'https://appleid.apple.com/auth/keys' });
      const decoded = jwt.decode(identityToken, { complete: true });
      if (!decoded || typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid Apple token format');
      }
      const key = await client.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(identityToken, publicKey, {
        algorithms: ['RS256'],
        audience: this.config.get<string>('APPLE_CLIENT_ID'),
        issuer: 'https://appleid.apple.com',
      }) as jwt.JwtPayload;

      if (!payload?.sub) throw new UnauthorizedException('Invalid Apple token payload');
      const email = payload.email || `${payload.sub}@privaterelay.appleid.com`;
      return this.findOrCreateOAuthUser(email, fullName || email, 'apple', res);
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Apple authentication failed');
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // CLEANUP  (cron)
  // ─────────────────────────────────────────────────────────────────

  async cleanupExpiredTokens() {
    const now = new Date();
    const [r, u] = await Promise.all([
      this.prisma.refreshToken.deleteMany({
        where: { OR: [{ expiresAt: { lt: now } }, { revokedAt: { not: null } }] },
      }),
      this.prisma.user.updateMany({
        where: {
          OR: [
            { verificationExpiresAt: { lt: now }, emailVerified: false },
            { resetTokenExpiresAt: { lt: now } },
          ],
        },
        data: {
          verificationCode: null,
          verificationExpiresAt: null,
          resetToken: null,
          resetTokenExpiresAt: null,
        },
      }),
    ]);
    this.logger.log(`Cleanup: ${r.count} refresh tokens, ${u.count} users cleared`);
  }
}