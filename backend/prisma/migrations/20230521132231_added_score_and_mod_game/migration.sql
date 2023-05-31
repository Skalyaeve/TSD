/*
  Warnings:

  - Added the required column `score` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `timeEnd` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `winner` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_winner_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "score" INTEGER NOT NULL,
ALTER COLUMN "timeEnd" SET NOT NULL,
ALTER COLUMN "winner" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winner_fkey" FOREIGN KEY ("winner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
