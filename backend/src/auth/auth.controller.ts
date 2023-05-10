import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/GoogleGuard';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

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
    handle42Redirect(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {}

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    // DEBUGGING
    @Post('new')
    async createOneUser(@Body() createUserDto: CreateUserDto) {

        console.log(createUserDto);
        const user = await this.userService.findOrCreateOne(createUserDto);

        return this.authService.login(user);
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
