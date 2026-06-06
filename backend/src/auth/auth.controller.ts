import {
  Controller, Post, Body, Get, Req, Res,
  UseGuards, HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(201)
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('logout-all')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logoutAll(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.logoutAll(req.user.userId, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }

  // ✅ FIXED: now sends { email, code } — matches verifyEmail(email, code)
  @Post('verify-email')
  @HttpCode(200)
  verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
  }

  // ✅ FIXED: takes email from body directly (no JWT needed — user may not be logged in)
  @Post('resend-verification')
  @HttpCode(200)
  resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerification(body.email);
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.authService.changePassword(req.user.userId, body.currentPassword, body.newPassword);
  }

  @Post('google')
  @HttpCode(200)
  googleAuth(@Body() body: { accessToken: string }, @Res({ passthrough: true }) res: Response) {
    return this.authService.googleAuth(body.accessToken, res);
  }

  @Post('facebook')
  @HttpCode(200)
  facebookAuth(@Body() body: { accessToken: string }, @Res({ passthrough: true }) res: Response) {
    return this.authService.facebookAuth(body.accessToken, res);
  }

  @Post('apple')
  @HttpCode(200)
  appleAuth(
    @Body() body: { identityToken: string; fullName?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.appleAuth(body.identityToken, body.fullName, res);
  }
}