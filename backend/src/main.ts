// import { NestFactory, Reflector } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import cookieParser from 'cookie-parser';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const config = app.get(ConfigService);

//   // Cookie parser (required for refresh token cookie)
//   app.use(cookieParser(config.get('cookie.secret')));

//   // Global validation pipe — enforces all DTOs
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist:        true,   // strip unknown fields
//     forbidNonWhitelisted: true, // error on unknown fields
//     transform:        true,   // auto-transform types
//     transformOptions: { enableImplicitConversion: true },
//   }));

//   // CORS — allow credentials for cookies
//   app.enableCors({
//     origin:      config.get('app.url'),
//     credentials: true,       // required for HttpOnly cookie
//     methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   });

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // ← required for webhook signature verification
  });
  const config = app.get(ConfigService);

  // ✅ Must be before any route handling
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist:            true,
    forbidNonWhitelisted: false, // don't throw on unknown fields — more forgiving
    transform:            true,
    transformOptions:     { enableImplicitConversion: true },
  }));

  app.enableCors({
    origin:      ['http://localhost:3000'],
    credentials: true, // ✅ Required for cookies to work cross-origin
    methods:     ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  });

  const port = config.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();