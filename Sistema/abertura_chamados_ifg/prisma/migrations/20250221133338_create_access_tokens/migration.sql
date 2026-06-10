/*
  Warnings:

  - Added the required column `userId` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessToken" ADD COLUMN     "userId" TEXT NOT NULL;
