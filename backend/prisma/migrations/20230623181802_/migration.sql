/*
  Warnings:

  - You are about to drop the column `characterId` on the `User` table. All the data in the column will be lost.
  - Added the required column `rank` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_characterId_fkey";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "rank" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "characterId",
ADD COLUMN     "character" TEXT NOT NULL DEFAULT 'Boreas';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_character_fkey" FOREIGN KEY ("character") REFERENCES "Character"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
