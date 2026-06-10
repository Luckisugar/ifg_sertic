/*
  Warnings:

  - You are about to drop the column `userId` on the `AccessToken` table. All the data in the column will be lost.
  - Added the required column `matricula` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessToken" DROP COLUMN "userId",
ADD COLUMN     "matricula" TEXT NOT NULL;
