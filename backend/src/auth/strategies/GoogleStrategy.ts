import { Injectable } from "@nestjs/common";
import { Inject } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super({
            clientID: process.env.GoogleClientID,
            clientSecret: process.env.GoogleClientSecret,
            callbackURL: process.env.GoogleCallBackURL,
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            nickname: profile.displayName,
            avatarURL: profile.photos[0].value
        });
        console.log('Validate');
        console.log(user);
        return user || null;
    }
}