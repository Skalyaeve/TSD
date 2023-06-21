/*
  Warnings:

  - You are about to drop the column `owner` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `avatarURL` on the `User` table. All the data in the column will be lost.
  - Added the required column `chanOwner` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_owner_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "owner",
ADD COLUMN     "chanOwner" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarURL";

-- CreateTable
CREATE TABLE "Avatar" (
    "avatarOwner" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("avatarOwner")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_path_key" ON "Avatar"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_filename_key" ON "Avatar"("filename");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_avatarOwner_fkey" FOREIGN KEY ("avatarOwner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_chanOwner_fkey" FOREIGN KEY ("chanOwner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
