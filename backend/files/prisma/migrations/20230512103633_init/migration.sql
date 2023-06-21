/*
  Warnings:

  - You are about to drop the column `login` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_login_key";

-- AlterTable
CREATE SEQUENCE matchhistory_id_seq;
ALTER TABLE "MatchHistory" ALTER COLUMN "id" SET DEFAULT nextval('matchhistory_id_seq');
ALTER SEQUENCE matchhistory_id_seq OWNED BY "MatchHistory"."id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "login";
