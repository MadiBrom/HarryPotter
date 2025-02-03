/*
  Warnings:

  - Added the required column `type` to the `WandTestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WandTestResult" ADD COLUMN     "type" TEXT NOT NULL;
