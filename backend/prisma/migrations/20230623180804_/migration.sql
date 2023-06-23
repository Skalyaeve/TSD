/*
  Warnings:

  - You are about to drop the column `rank` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `character` on the `User` table. All the data in the column will be lost.
  - Added the required column `characterId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_character_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "rank";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "character",
ADD COLUMN     "characterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
