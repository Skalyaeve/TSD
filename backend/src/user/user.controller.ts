import { Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Request, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import * as fs from 'fs';
import { join } from "path";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('connected')
    @UseGuards(JwtGuard)
    IsConnected(@Request() req: any) {
        return req.user;
    }

    @Get('all')
    @UseGuards(JwtGuard)
    async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('avatar/download')
    @UseGuards(JwtGuard)
    async getAvatar(@Request() req: any): Promise<StreamableFile> {
        const user = await this.userService.findOneByIdOrThrow(req.user.id);
        const path = 'upload/avatars/' + user.avatarFilename;
        const file = fs.createReadStream(join(process.cwd(), path))
        return new StreamableFile(file);
    }

    @Post('avatar/upload')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file', { dest: 'upload/avatars' }))
    async uploadAvatar(
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 2097152 }),
            ]})) file: Express.Multer.File,
        @Request() req: any): Promise<User> {
        const user = await this.userService.findOneByIdOrThrow(req.user.id);
        if (user.avatarFilename !== 'default.png') {
            const path = 'upload/avatars/' + user.avatarFilename;
            fs.unlink(path, (err) => {
            if (err) throw err;
            console.log(path + ' was deleted');
        });
        }
        return this.userService.updateAvatar(req.user.id, file.filename);
    }

    @Delete()
    @UseGuards(JwtGuard)
    async deleteOneUser(@Request() req) {
        return this.userService.deleteOneById(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOneById(id);
    }

    @Get(':id/stats')
    @UseGuards(JwtGuard)
    async getOneStatsById(@Param('id', ParseIntPipe) id: number) {
        
    }

}