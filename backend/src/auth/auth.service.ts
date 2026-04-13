import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ── Shared: find or create OAuth user ───────────────────────────
  private async findOrCreateOAuthUser(email: string, fullName: string, provider: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName,
          passwordHash: '',
          provider,
        },
      });
    }

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // ── Register ─────────────────────────────────────────────────────
  async register(
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    healthProfile?: {
      age?: string;
      gender?: string;
      backPain?: boolean;
      jointPain?: boolean;
      sportsInjury?: boolean;
      neckIssues?: boolean;
      activityLevel?: string;
    },
  ) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        provider: 'email',
        healthProfile: healthProfile
          ? {
              create: {
                age: healthProfile.age,
                gender: healthProfile.gender,
                backPain: healthProfile.backPain ?? false,
                jointPain: healthProfile.jointPain ?? false,
                sportsInjury: healthProfile.sportsInjury ?? false,
                neckIssues: healthProfile.neckIssues ?? false,
                activityLevel: healthProfile.activityLevel,
              },
            }
          : undefined,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // ── Login ─────────────────────────────────────────────────────────
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // ── Google ────────────────────────────────────────────────────────
  async googleAuth(credential: string) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.email) throw new UnauthorizedException('Invalid Google token');

      return this.findOrCreateOAuthUser(
        payload.email,
        payload.name || payload.email,
        'google',
      );
    } catch {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  // ── Facebook ──────────────────────────────────────────────────────
  async facebookAuth(accessToken: string) {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
      );

      if (!data?.email) throw new UnauthorizedException('Email not provided by Facebook');

      return this.findOrCreateOAuthUser(data.email, data.name, 'facebook');
    } catch {
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }

  // ── Apple ─────────────────────────────────────────────────────────
  async appleAuth(identityToken: string, fullName?: string) {
    try {
      const client = new JwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
      });

      const decoded = jwt.decode(identityToken, { complete: true });
      if (!decoded || typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid Apple token');
      }

      const key = await client.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const payload = jwt.verify(identityToken, publicKey, {
        algorithms: ['RS256'],
        audience: process.env.APPLE_CLIENT_ID,
        issuer: 'https://appleid.apple.com',
      }) as jwt.JwtPayload;

      if (!payload?.sub) throw new UnauthorizedException('Invalid Apple token payload');

      const email = payload.email || `${payload.sub}@privaterelay.appleid.com`;
      const name = fullName || email;

      return this.findOrCreateOAuthUser(email, name, 'apple');
    } catch {
      throw new UnauthorizedException('Apple authentication failed');
    }
  }
}