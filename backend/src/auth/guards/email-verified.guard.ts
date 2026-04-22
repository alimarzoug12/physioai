import {
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SKIP_EMAIL_VERIFICATION = 'skipEmailVerification';

// Decorator to skip verification check on specific routes
import { SetMetadata } from '@nestjs/common';
export const SkipEmailVerification = () =>
  SetMetadata(SKIP_EMAIL_VERIFICATION, true);

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_EMAIL_VERIFICATION,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (skip) return true;

    const request = ctx.switchToHttp().getRequest();
    const user    = request.user;

    if (!user?.emailVerified) {
      throw new ForbiddenException(
        'Please verify your email address before continuing. Check your inbox for the verification link.',
      );
    }
    return true;
  }
}