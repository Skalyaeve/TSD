import { Controller, Get, UseGuards, Req, Post, Body, Res, UseFilters, UnauthorizedException, BadRequestException } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/GoogleGuard.js';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard.js';
import { UserService } from '../user/user.service.js';
import { CallbackExceptionFilter } from './filter/callback-exception.filter.js';
import { JwtGuard } from './guards/JwtGuard.js';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { JwtTwoFactorGuard } from './guards/JwtTwoFactorGuard.js';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService, // REMOVE
    ) {}

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    handle42Loging() {}

    @Get('42/callback')
    @UseGuards(FortyTwoAuthGuard)
    @UseFilters(CallbackExceptionFilter)
    async handle42Redirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.login(req.user, false);
        res.cookie('access_token', access_token, {
            maxAge: 60 * 60 * 24 * 7,
        });
        res.redirect('http://localhost:8080');
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {}

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleRedirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.login(req.user, false);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
    }

    @Get('logout')
    @UseGuards(JwtGuard)
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): any {
        res.clearCookie('access_token', {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
        res.redirect('http://localhost:8080');
        return (req.user);
    }

    @Post('2FA/on')
    @UseGuards(JwtGuard)
    async activate2FA(@Req() req: any): Promise<User> {
        const secret: string = authenticator.generateSecret();
        const user: User = await this.userService.update2FAStatus(req.user.id, true, secret);
        return user;
    }

    @Post('2FA/off')
    @UseGuards(JwtGuard)
    async deactivate2FA(@Req() req: any): Promise<User> {
        const user: User = await this.userService.update2FAStatus(req.user.id, false, null);
        return user;
    }

    @Get('2FA/qrcode')
    @UseGuards(JwtGuard)
    async generateQRCode(@Req() req: any, @Res() res: any): Promise<any> {
        const user: User = await this.userService.findOneByIdOrThrow(req.user.id);
        if (!user.twoFactorAuthStatus) {
            throw new BadRequestException('user has not activated 2FA');
        }
        const otpauthURL: string = authenticator.keyuri(user.email, 'transcendance', user.twoFactorAuthSecret);
        return toFileStream(res, otpauthURL);
    }

    @Get('2FA/verify')
    @UseGuards(JwtTwoFactorGuard)
    async verify2FACode(@Req() req: any, @Res({ passthrough: true }) res: Response, @Body('code') code: string): Promise<any> {
        if (!req.user.is2FAEnabled || req.user.is2FAAuthenticated) {
            return;
        }
        const user: User = await this.userService.findOneByIdOrThrow(req.user.id);
        const isValid: boolean = authenticator.verify({
            token: code,
            secret: user.twoFactorAuthSecret,
        });
        if (!isValid) {
            throw new UnauthorizedException('wrong authenticator code');
        }
        const access_token = await this.authService.login(user, true);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
    }

    // DEBUGGING
    @Post('new')
    async createOneUser(@Body() userInfo: any, @Res({ passthrough: true }) res: Response) {

        console.log(userInfo);
        const user = await this.userService.findOrCreateOne(userInfo.email);

        const access_token = await this.authService.login(user, false);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    /*
    @Get('status')
    user(@Req() request: Request)
    {
        console.log(request.user);
        if (request.user) {
            return { msg: 'Authenticated'};
        } else {
            return { msg: 'Not Authenticated'};
        }
    }
    */
}
