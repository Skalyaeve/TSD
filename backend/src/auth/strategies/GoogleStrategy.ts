import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly userService: UserService) {
        super({
            clientID: process.env.GoogleClientID,
            clientSecret: process.env.GoogleClientSecret,
            callbackURL: process.env.GoogleCallBackURL,
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {

        const user = await this.userService.findOrCreateOne({
            email: profile.emails[0].value,
            nickname: profile.displayName,
            avatarURL: profile.photos[0].value
        });

        return user;
    }
}