/*
  Warnings:

  - You are about to drop the column `player1Score` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Score` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "player1Score",
DROP COLUMN "player2Score";
