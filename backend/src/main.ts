import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');
  app.use(session({
    secret: 'adjkashdaskjdhlashdkashdsa',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
