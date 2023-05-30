import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadDto } from "../dto/payload.dto.js";

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtTwoFactorStrategy.extractJWTFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.jwtSecret,
        });
    }

    private static extractJWTFromCookie(@Req() req: Request): string | null {
        if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
        }
        return null;
    }

    async validate(payload: PayloadDto): Promise<any> {
        return payload;
    }

}