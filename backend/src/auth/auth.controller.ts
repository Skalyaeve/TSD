import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/GoogleGuard';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    handle42Loging(){
        return {msg: 'You are trying to log in with 42'};
    }

    @Get('42/callback')
    @UseGuards(FortyTwoAuthGuard)
    handle42Redirect(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin()
    {
        return { msg: 'Google Authentication'};
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect(@Req() req: Request) {
        return this.authService.login(req.user);
    }

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
}
