import './instrument';

// import * as Sentry from '@sentry/nestjs';
// import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/nestjs';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import {
  ExceptionFilter, Catch,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';

// ── Custom Sentry filter (replaces buggy SentryGlobalFilter) ──────
@Catch()
class SentryFilter implements ExceptionFilter {
  private readonly logger = new Logger('SentryFilter');

  @SentryExceptionCaptured()   // ← ADD this decorator
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500) {
      Sentry.captureException(exception);
      this.logger.error(`[Sentry] Captured: ${exception}`);
    }

    if (res && !res.headersSent) {
      const message = exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

      res.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: req?.url,
      });
    }
  }
}
// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   environment: process.env.NODE_ENV,
//   integrations: [nodeProfilingIntegration()],
//   tracesSampleRate: 1.0,
//   profilesSampleRate: 1.0,
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // ← required for webhook signature verification
  });
  const config = app.get(ConfigService);

  // ✅ Must be before any route handling
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // don't throw on unknown fields — more forgiving
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true, // ✅ Required for cookies to work cross-origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  const port = config.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();