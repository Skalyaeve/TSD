import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { UserGameService } from "./user_game.service.js";
import { JwtGuard } from "../auth/guards/JwtGuard.js"
import { Game } from "@prisma/client";
import { CreateGameDto } from "./dto/create-game.dto.js";

@Controller('games')
export class UserGameController {
    constructor(private userGameService: UserGameService) {}

    @Get('all')
    @UseGuards(JwtGuard)
    async getAll(): Promise<Game[]> {
        return this.userGameService.findAll();
    }

    @Get('all/count')
    @UseGuards(JwtGuard)
    async getAllCount(): Promise<number> {
        return this.userGameService.countAll();
    }

    @Get('latest/:count')
    @UseGuards(JwtGuard)
    async getAllLatestGames(@Param('count', ParseIntPipe) count: number): Promise<Game[]> {
        return this.userGameService.findManyOrderedByDate(count);
    }

    @Get('own')
    @UseGuards(JwtGuard)
    async getOwnGames(@Req() req: any): Promise<Game[]> {
        return this.userGameService.findAllByOnePlayer(req.user.id);
    }

    @Get('own/count')
    @UseGuards(JwtGuard)
    async getOwnGamesCount(@Req() req: any): Promise<number> {
        return this.userGameService.countByPlayer(req.user.id);
    }

    @Get('vs/:id')
    @UseGuards(JwtGuard)
    async getOwnGamesVS(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<Game[]> {
        return this.userGameService.findAllByTwoPlayers(req.user.id, id);
    }

    @Get('victories')
    @UseGuards(JwtGuard)
    async getVictories(@Req() req: any): Promise<Game[]> {
        return this.userGameService.findAllByWinner(req.user.id);
    }

    @Get('victories/count')
    @UseGuards(JwtGuard)
    async getVictoriesCount(@Req() req: any): Promise<number> {
        return this.userGameService.countByWinner(req.user.id);
    }

    @Post('new')
    @UseGuards(JwtGuard)
    async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
        console.log(createGameDto);
        return this.userGameService.createOne(createGameDto);
    }

}