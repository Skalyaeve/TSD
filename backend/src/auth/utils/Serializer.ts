import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super();
    }

    //serializing the user into the session, when you log in
    serializeUser(user: any, done: Function) {
        console.log('Serialize User');
        done(null, user);
    }

    //takes the session and figures out who the session belongs to,
    //need to search for the user in the data base
    async deserializeUser(payload: any, done: Function) {
        console.log('Deserialize User');
        // console.log(payload);
        console.log('finished login payload');
        const user = await this.authService.findUser(payload.id);
        console.log(user);
        return user ? done(null, user) : done(null, null);
    }
}