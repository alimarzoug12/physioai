import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.get<string>('jwt.accessSecret');
    if (!secret) throw new Error('JWT_ACCESS_SECRET is not set in .env');

    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:      secret,
    });
  }

  async validate(payload: { userId: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where:  { id: payload.userId },
      select: { id: true, role: true, emailVerified: true },
    });
    if (!user) throw new UnauthorizedException('User no longer exists');
    return { userId: user.id, role: user.role, emailVerified: user.emailVerified };
  }
}