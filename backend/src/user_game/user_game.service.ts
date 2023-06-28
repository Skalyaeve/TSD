import { Injectable } from "@nestjs/common";
import { Game } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateGameDto } from "./dto/create-game.dto.js";

@Injectable()
export class UserGameService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Game[]> {
        const games = this.prisma.game.findMany({});
        return games;
    }

    async findAllByOnePlayer(id: number): Promise<Game[]> {
        const games = await this.prisma.game.findMany({
            where: {
                OR: [
                    {
                        player1: Number(id),
                    },
                    {
                        player2: Number(id),
                    },
                ],
            },
            orderBy: {
                timeStart: "asc",
            },
        });
        return games;
    }

    async findAllByTwoPlayers(id1: number, id2: number): Promise<Game[]> {
        const games = await this.prisma.game.findMany({
            where: {
                OR: [
                    {
                        player1: id1,
                        player2: id2,
                    },
                    {
                        player1: id2,
                        player2: id1,
                    },
                ],
            },
            orderBy: {
                timeStart: "asc",
            },
        });
        return games;
    }

    async findAllByWinner(id: number): Promise<Game[]> {
        const games = await this.prisma.game.findMany({
            where: {
                winner: Number(id),
            },
            orderBy: {
                timeStart: "asc",
            },
        });
        return games;
    }

    async findManyOrderedByDate(first: number, last: number): Promise<Game[]> {
        const skip: number = first - 1;
        const take: number = last - first + 1;
        const games: Game[] = await this.prisma.game.findMany({
            orderBy: {
                timeStart: "desc",
            },
            skip,
            take,
        });
        return games;
    }

    async findManyByUserOrderedByDate(id: number, first: number, last: number): Promise<Game[]> {
        const skip: number = first - 1;
        const take: number = last - first + 1;
        const games: Game[] = await this.prisma.game.findMany({
            where: {
                id,
            },
            orderBy: {
                timeStart: "desc",
            },
            skip,
            take,
        });
        return games;
    }

    async createOne(createGameDto: CreateGameDto): Promise<Game> {
        const { player1, player2, timeStart, timeEnd, winner } = createGameDto;
        const game = await this.prisma.game.create({
            data: {
                player1Ref: {
                    connect: {
                        id: player1,
                    },
                },
                player2Ref: {
                    connect: {
                        id: player2,
                    },
                },
                timeStart,
                timeEnd,
                winnerRef: {
                    connect: {
                        id: winner,
                    },
                },
            },
        });
        return game;
    }

    async countByWinner(id: number): Promise<number> {
        const gamesCount = await this.prisma.game.count({
            where: {
                winner: Number(id),
            },
        });
        return gamesCount;
    }

    async countByPlayer(id: number): Promise<number> {
        const gamesCount = await this.prisma.game.count({
            where: {
                OR: [
                    {
                        player1: id,
                    },
                    {
                        player2: id,
                    },
                ],
            },
        });
        return gamesCount;
    }

    async countAll(): Promise<number> {
        const gamesCount = await this.prisma.game.count({});
        return gamesCount;
    }

}