/*
  Warnings:

  - You are about to drop the column `score` on the `Game` table. All the data in the column will be lost.
  - Added the required column `player1Score` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Score` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "score",
ADD COLUMN     "player1Score" INTEGER NOT NULL,
ADD COLUMN     "player2Score" INTEGER NOT NULL;
