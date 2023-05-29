/*
  Warnings:

  - The primary key for the `Blocked` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[blocker,blockee]` on the table `Blocked` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Blocked" DROP CONSTRAINT "Blocked_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Blocked_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Blocked_blocker_blockee_key" ON "Blocked"("blocker", "blockee");
