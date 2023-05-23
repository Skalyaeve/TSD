import { Controller, Get, UseGuards, Req, Post, Body, Res, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/GoogleGuard.js';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard.js';
import { UserService } from '../user/user.service.js';
import { CallbackExceptionFilter } from './filter/callback-exception.filter.js';

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
        });
    }

    // DEBUGGING
    @Post('new')
    async createOneUser(@Body() createUserDto: any, @Res({ passthrough: true }) res: Response) {

        console.log(createUserDto);
        const user = await this.userService.findOrCreateOne(createUserDto.email);

        const access_token = await this.authService.login(user);
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
