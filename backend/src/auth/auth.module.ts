import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { FortyTwoStrategy } from './strategies/FortyTwoStrategy';
import { JwtStrategy } from './strategies/JwtStrategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({defaultStrategy: '42'})
  ],
  providers: [
    FortyTwoStrategy,
    GoogleStrategy,
    JwtStrategy,
    AuthService,
    ],
  controllers: [AuthController]
})
export class AuthModule {}
