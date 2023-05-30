import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { GoogleStrategy } from './strategies/GoogleStrategy.js';
import { FortyTwoStrategy } from './strategies/FortyTwoStrategy.js';
import { JwtStrategy } from './strategies/JwtStrategy.js';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module.js';
import { UserService } from '../user/user.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { JwtTwoFactorStrategy } from './strategies/JwtTwoFactorStrategy.js';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule,
    UserModule,
  ],
  providers: [
    FortyTwoStrategy,
    GoogleStrategy,
    JwtStrategy,
    JwtTwoFactorStrategy,
    AuthService,
    UserService,
    PrismaService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
