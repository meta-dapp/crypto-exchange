import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as createRedisStore from 'connect-redis';
import Redis from 'ioredis'

import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('secure/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  const RedisStore = createRedisStore(session);
  const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: process.env.TOKEN_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: parseInt(process.env.EXPIRE_IN) }
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT);
}
bootstrap();
