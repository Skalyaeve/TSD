/*
  Warnings:

  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the `CharacterList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharacterList" DROP CONSTRAINT "CharacterList_character_fkey";

-- DropForeignKey
ALTER TABLE "CharacterList" DROP CONSTRAINT "CharacterList_player_fkey";

-- DropIndex
DROP INDEX "Character_name_key";

-- AlterTable
ALTER TABLE "Character" DROP CONSTRAINT "Character_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Character_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "character" SET DEFAULT 'Boreas';

-- DropTable
DROP TABLE "CharacterList";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_character_fkey" FOREIGN KEY ("character") REFERENCES "Character"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
