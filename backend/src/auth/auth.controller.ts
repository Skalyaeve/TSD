import { Controller, Get, UseGuards, Req, Post, Body, Res, UseFilters, HttpException, BadRequestException } from '@nestjs/common';
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
    async handle42Redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.login(req.user);
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
    async handleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const access_token = await this.authService.login(req.user);
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

    @Post('2FA/activate')
    @UseGuards(JwtGuard)
    async activate2FA(@Req() req: any): Promise<User> {
        let user: User = await this.userService.findOneById(req.user.id);
        if (!user.twoFactorAuth) {
            const secret = authenticator.generateSecret();
            user = await this.userService.update2FASecret(req.user.id, true, secret);
        }
        return user;
    }

    @Post('2FA/deactivate')
    @UseGuards(JwtGuard)
    async deactivate2FA(@Req() req: any): Promise<User> {
        const user: User = await this.userService.update2FASecret(req.user.id, false, null);
        return user;
    }

    @Get('2FA/login')
    @UseGuards(JwtGuard)
    async twoFactorAuthLogin(@Req() req: any, @Res() res: Response): Promise<User> {
        const user: User = await this.userService.findOneById(req.user.id);
        if (!user.twoFactorAuth) {
            throw new BadRequestException('user has not enabled two factor authentication');
        }
        const otpauth = authenticator.keyuri(user.email, 'transcendance', user.twoFactorSecret);
        return toFileStream(res, otpauth);
    }

    // DEBUGGING
    @Post('new')
    async createOneUser(@Body() userInfo: any, @Res({ passthrough: true }) res: Response) {

        console.log(userInfo);
        const user = await this.userService.findOrCreateOne(userInfo.email);

        const access_token = await this.authService.login(user); res.cookie('access_token', access_token, {
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
