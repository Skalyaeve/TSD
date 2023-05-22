
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-42';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
		super({
			clientID: process.env.FortyTwoClientID,
			clientSecret: process.env.FortyTwoSecret,
			callbackURL: process.env.FortyTwoCallBackURL
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<User> {

		const user = await this.userService.findOrCreateOne(profile.emails[0].value);
		console.log(user)
		return user;
	}
}