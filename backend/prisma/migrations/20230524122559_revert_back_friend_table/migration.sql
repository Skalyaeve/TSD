/*
  Warnings:

  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_requestee_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_requester_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_friend1_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_friend2_fkey";

-- DropTable
DROP TABLE "FriendRequest";

-- DropTable
DROP TABLE "Friendship";

-- CreateTable
CREATE TABLE "Friend" (
    "requester" INTEGER NOT NULL,
    "requestee" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("requester","requestee")
);

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_requester_fkey" FOREIGN KEY ("requester") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_requestee_fkey" FOREIGN KEY ("requestee") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
