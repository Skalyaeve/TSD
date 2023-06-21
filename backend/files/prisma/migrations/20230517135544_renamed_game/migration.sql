/*
  Warnings:

  - You are about to drop the `MatchHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_player1_fkey";

-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_player2_fkey";

-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_winner_fkey";

-- DropTable
DROP TABLE "MatchHistory";

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,
    "timeStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeEnd" TIMESTAMP(3),
    "winner" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1_fkey" FOREIGN KEY ("player1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2_fkey" FOREIGN KEY ("player2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winner_fkey" FOREIGN KEY ("winner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
