/*
  Warnings:

  - Added the required column `avatarURL` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ChanType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarURL" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "Friend" (
    "requester" INTEGER NOT NULL,
    "requestee" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("requester","requestee")
);

-- CreateTable
CREATE TABLE "Blocked" (
    "blocker" INTEGER NOT NULL,
    "blockee" INTEGER NOT NULL,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("blocker","blockee")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" INTEGER NOT NULL,
    "type" "ChanType" NOT NULL DEFAULT 'PUBLIC',
    "passwd" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChanMember" (
    "chanId" INTEGER NOT NULL,
    "member" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "muteTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChanMember_pkey" PRIMARY KEY ("chanId","member")
);

-- CreateTable
CREATE TABLE "ChanBan" (
    "chanId" INTEGER NOT NULL,
    "bannedUser" INTEGER NOT NULL,

    CONSTRAINT "ChanBan_pkey" PRIMARY KEY ("chanId","bannedUser")
);

-- CreateTable
CREATE TABLE "ChanMessage" (
    "sender" INTEGER NOT NULL,
    "chanId" INTEGER NOT NULL,
    "timeSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "ChanMessage_pkey" PRIMARY KEY ("sender","chanId","timeSent")
);

-- CreateTable
CREATE TABLE "PrivMessage" (
    "sender" INTEGER NOT NULL,
    "recipient" INTEGER NOT NULL,
    "timeSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "PrivMessage_pkey" PRIMARY KEY ("sender","recipient","timeSent")
);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" INTEGER NOT NULL,
    "player1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,
    "timeStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeEnd" TIMESTAMP(3),
    "winner" INTEGER,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_requester_fkey" FOREIGN KEY ("requester") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_requestee_fkey" FOREIGN KEY ("requestee") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_blocker_fkey" FOREIGN KEY ("blocker") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_blockee_fkey" FOREIGN KEY ("blockee") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanMember" ADD CONSTRAINT "ChanMember_chanId_fkey" FOREIGN KEY ("chanId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanMember" ADD CONSTRAINT "ChanMember_member_fkey" FOREIGN KEY ("member") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanBan" ADD CONSTRAINT "ChanBan_chanId_fkey" FOREIGN KEY ("chanId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanBan" ADD CONSTRAINT "ChanBan_bannedUser_fkey" FOREIGN KEY ("bannedUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanMessage" ADD CONSTRAINT "ChanMessage_sender_fkey" FOREIGN KEY ("sender") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChanMessage" ADD CONSTRAINT "ChanMessage_chanId_fkey" FOREIGN KEY ("chanId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivMessage" ADD CONSTRAINT "PrivMessage_sender_fkey" FOREIGN KEY ("sender") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivMessage" ADD CONSTRAINT "PrivMessage_recipient_fkey" FOREIGN KEY ("recipient") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_player1_fkey" FOREIGN KEY ("player1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_player2_fkey" FOREIGN KEY ("player2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_winner_fkey" FOREIGN KEY ("winner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
