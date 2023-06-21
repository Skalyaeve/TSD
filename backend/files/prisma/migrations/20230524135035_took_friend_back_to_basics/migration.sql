/*
  Warnings:

  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_requestee_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_requester_fkey";

-- DropTable
DROP TABLE "Friend";

-- CreateTable
CREATE TABLE "FriendRequest" (
    "requester" INTEGER NOT NULL,
    "requestee" INTEGER NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("requester","requestee")
);

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requester_fkey" FOREIGN KEY ("requester") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requestee_fkey" FOREIGN KEY ("requestee") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
