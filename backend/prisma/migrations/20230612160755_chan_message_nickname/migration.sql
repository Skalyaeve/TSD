/*
  Warnings:

  - Added the required column `senderNick` to the `ChanMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChanMessage" ADD COLUMN     "senderNick" TEXT NOT NULL;
