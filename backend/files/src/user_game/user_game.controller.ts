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

    @Get('all/latest/:first/:last')
    @UseGuards(JwtGuard)
    async getAllLatestGames(@Param('first', ParseIntPipe) first: number, @Param('last', ParseIntPipe) last: number): Promise<Game[]> {
        return this.userGameService.findManyOrderedByDate(first, last);
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

    @Get('own/latest/:first/:last')
    @UseGuards(JwtGuard)
    async getOwnLatestGames(@Req() req: any, @Param('first') first: number, @Param('last') last: number): Promise<Game[]> {
        return this.userGameService.findManyByUserOrderedByDate(req.user.id, first, last);
    }

    @Get('own/vs/:id')
    @UseGuards(JwtGuard)
    async getOwnGamesVS(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<Game[]> {
        return this.userGameService.findAllByTwoPlayers(req.user.id, id);
    }

    @Get('own/victories')
    @UseGuards(JwtGuard)
    async getVictories(@Req() req: any): Promise<Game[]> {
        return this.userGameService.findAllByWinner(req.user.id);
    }

    @Get('own/victories/count')
    @UseGuards(JwtGuard)
    async getVictoriesCount(@Req() req: any): Promise<number> {
        return this.userGameService.countByWinner(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    async getGamesByID(@Param('id') id: number): Promise<Game[]> {
        return this.userGameService.findAllByOnePlayer(id);
    }

    @Get(':id/count')
    @UseGuards(JwtGuard)
    async getGamesCountByID(@Param('id') id: number): Promise<number> {
        return this.userGameService.countByPlayer(id);
    }

    @Get(':id/latest/:first/:last')
    @UseGuards(JwtGuard)
    async getLatestGamesByID(@Param('id') id: number, @Param('first') first: number, @Param('last') last: number): Promise<Game[]> {
        return this.userGameService.findManyByUserOrderedByDate(id, first, last);
    }

    @Get(':id1/vs/:id2')
    @UseGuards(JwtGuard)
    async getVSGamesByID(@Param('id1', ParseIntPipe) id1: number, @Param('id2') id2: number): Promise<Game[]> {
        return this.userGameService.findAllByTwoPlayers(id1, id2);
    }

    @Get(':id/victories')
    @UseGuards(JwtGuard)
    async getVictoriesByID(@Param('id') id: number): Promise<Game[]> {
        return this.userGameService.findAllByWinner(id);
    }

    @Get(':id/victories/count')
    @UseGuards(JwtGuard)
    async getVictoriesCountByID(@Param('id') id: number): Promise<number> {
        return this.userGameService.countByWinner(id);
    }

    @Post('new')
    @UseGuards(JwtGuard)
    async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
        console.log(createGameDto);
        return this.userGameService.createOne(createGameDto);
    }

}