import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { FortyTwoStrategy } from './strategies/FortyTwoStrategy';
import { JwtStrategy } from './strategies/JwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  providers: [
    FortyTwoStrategy,
    GoogleStrategy,
    JwtStrategy,
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
