/*
  Warnings:

  - You are about to drop the column `rank` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_character_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "rank";
