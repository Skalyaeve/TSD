import { Controller, Delete, Get, Param, ParseIntPipe, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/guards/JwtGuard";
import { User } from "@prisma/client";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('all')
    @UseGuards(JwtGuard)
    async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOneById(id);
    }

    @Delete()
    @UseGuards(JwtGuard)
    async deleteOneUser(@Request() req) {
        return this.userService.deleteOneById(req.user.id);
    }

}