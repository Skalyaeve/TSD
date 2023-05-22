import { BadRequestException, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Request, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import * as fs from 'fs';
import { join } from "path";
import { diskStorage } from "multer";

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
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req: any): Promise<User> {
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