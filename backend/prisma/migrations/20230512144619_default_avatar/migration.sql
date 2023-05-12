/*
  Warnings:

  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_avatarOwner_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarFilename" TEXT NOT NULL DEFAULT 'default.png';

-- DropTable
DROP TABLE "Avatar";
