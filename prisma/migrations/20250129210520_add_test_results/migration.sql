/*
  Warnings:

  - Added the required column `answers` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "answers" TEXT NOT NULL;
