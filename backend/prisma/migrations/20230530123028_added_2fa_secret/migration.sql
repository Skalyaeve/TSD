/*
  Warnings:

  - You are about to drop the column `twoFactorAuth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFactorAuth",
ADD COLUMN     "twoFactorAuthSecret" TEXT,
ADD COLUMN     "twoFactorAuthStatus" BOOLEAN NOT NULL DEFAULT false;
