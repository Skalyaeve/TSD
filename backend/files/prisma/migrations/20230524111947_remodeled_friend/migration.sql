/*
  Warnings:

  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_requestee_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_requester_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "timeStart" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Friend";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "friend1" INTEGER NOT NULL,
    "friend2" INTEGER NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "requester" INTEGER NOT NULL,
    "requestee" INTEGER NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("requester","requestee")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friend1_friend2_key" ON "Friendship"("friend1", "friend2");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_friend2_friend1_key" ON "Friendship"("friend2", "friend1");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend1_fkey" FOREIGN KEY ("friend1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend2_fkey" FOREIGN KEY ("friend2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requester_fkey" FOREIGN KEY ("requester") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requestee_fkey" FOREIGN KEY ("requestee") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
