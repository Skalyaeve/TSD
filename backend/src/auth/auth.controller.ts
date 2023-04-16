import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/GoogleGuard';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard';

@Controller('auth')
export class AuthController {

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    handle42Loging(){
        return {msg: 'You are trying to log in with 42'};
    }

    @Get('42/callback')
    @UseGuards(FortyTwoAuthGuard)
    handle42Redirect() {
        return {msg: 'You succeeded to register with 42'};
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin()
    {
        return { msg: 'Google Authentication'};
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return { msg: 'OK' } ;
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
