import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { FortyTwoStrategy } from './strategies/FortyTwoStrategy';
import { SessionSerializer } from './utils/Serializer';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({defaultStrategy: '42'})
  ],
  providers: [
    FortyTwoStrategy,
    GoogleStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    }
    ],
  controllers: [AuthController]
})
export class AuthModule {}
