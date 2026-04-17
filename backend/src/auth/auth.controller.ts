import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(
    @Body() body: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
      healthProfile?: {
        age?: string;
        gender?: string;
        backPain?: boolean;
        jointPain?: boolean;
        sportsInjury?: boolean;
        neckIssues?: boolean;
        activityLevel?: string;
      };
    },
  ) {
    return this.authService.register(
      body.email,
      body.password,
      body.fullName,
      body.phone,
      body.healthProfile,
    );
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('google')
  googleAuth(@Body() body: { accessToken: string }) {
    return this.authService.googleAuth(body.accessToken);
  }

  @Post('facebook')
  facebookAuth(@Body() body: { accessToken: string }) {
    return this.authService.facebookAuth(body.accessToken);
  }

  @Post('apple')
  appleAuth(@Body() body: { identityToken: string; fullName?: string }) {
    return this.authService.appleAuth(body.identityToken, body.fullName);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }
}