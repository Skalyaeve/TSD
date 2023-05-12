import { Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/guards/JwtGuard";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { diskStorage } from "multer";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('all')
    @UseGuards(JwtGuard)
    async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post('avatar/upload')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: 'upload/avatars',
            filename: function(req, file, cb) {

            }
        })
         }))
    async uploadAvatar(
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 2097152 }),
                new FileTypeValidator({ fileType: 'image/jpeg' }),
                new FileTypeValidator({ fileType: 'image/png' }),
            ]})) file: Express.Multer.File,
        @Request() req: any): Promise<User> {

        const user = await this.userService.findOneByIdOrThrow(req.user.id);
        if (user.avatarFilename !== 'default.png') {
           fs.unlink
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