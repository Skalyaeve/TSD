
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-42';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.FortyTwoClientID,
      clientSecret: process.env.FortyTwoSecret,
      callbackURL: process.env.FortyTwoCallBackURL
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {

    const user = await this.userService.findOrCreateOne({
        email: profile.emails[0].value,
        nickname: profile.username,
    });

    return user;
  }
}