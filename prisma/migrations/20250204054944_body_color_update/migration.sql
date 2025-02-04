/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bodyColor" TEXT NOT NULL DEFAULT '#FFFFFF';

-- DropTable
DROP TABLE "Activity";
