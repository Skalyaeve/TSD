/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[requester,requestee]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestee,requester]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_requester_requestee_key" ON "Friend"("requester", "requestee");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_requestee_requester_key" ON "Friend"("requestee", "requester");
