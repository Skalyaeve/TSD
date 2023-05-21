import { Type } from "class-transformer";
import { IsDate, IsInt } from "class-validator";

export class CreateGameDto {
    
    @IsInt()
    @Type(() => Number)
    player1: number;

    @IsInt()
    @Type(() => Number)
    player2: number;

    @IsDate()
    @Type(() => Date)
    timeStart: Date;

    @IsDate()
    @Type(() => Date)
    timeEnd: Date;

    @IsInt()
    @Type(() => Number)
    winner: number;

}