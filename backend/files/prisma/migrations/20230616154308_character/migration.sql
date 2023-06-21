/*
  Warnings:

  - Added the required column `character` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "character" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterList" (
    "player" INTEGER NOT NULL,
    "character" INTEGER NOT NULL,

    CONSTRAINT "CharacterList_pkey" PRIMARY KEY ("player","character")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- AddForeignKey
ALTER TABLE "CharacterList" ADD CONSTRAINT "CharacterList_player_fkey" FOREIGN KEY ("player") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterList" ADD CONSTRAINT "CharacterList_character_fkey" FOREIGN KEY ("character") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
