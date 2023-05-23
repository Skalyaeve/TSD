import { BadRequestException, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import * as fs from 'fs';
import { diskStorage } from "multer";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('connected')
    @UseGuards(JwtGuard)
    IsConnected(@Req() req: any) {
        return req.user;
    }

    @Get('all')
    @UseGuards(JwtGuard)
    async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post('avatar/upload')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'upload/avatars');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg';
                cb(null, file.fieldname + '-' + uniqueSuffix);
            },
        }),
        limits: {
            fieldSize: 2097152,
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/jpeg') {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
    }))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<User> {
        if (!file) {
            throw new BadRequestException('can only upload jpeg files');
        }
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
    async deleteOneUser(@Req() req: any) {
        return this.userService.deleteOneById(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOneById(id);
    }

}