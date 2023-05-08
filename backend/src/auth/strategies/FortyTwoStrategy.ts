
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,) {
    super({
      clientID: process.env.FortyTwoClientID,
      clientSecret: process.env.FortyTwoSecret,
      callbackURL: process.env.FortyTwoCallBackURL
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = await this.authService.validateFortyTwoUser({
        email: profile.emails[0].value,
        nickname: profile.username,
        login: profile.username,
        avatarURL: profile._json.image.link
    });
    console.log('Validate');
    console.log(user);
    return user;
  }
}