/*
  Warnings:

  - You are about to drop the column `answer` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the column `houseResult` on the `TestResult` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('HOUSE', 'WAND');

-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "answer",
DROP COLUMN "houseResult",
ADD COLUMN     "answers" JSONB,
ADD COLUMN     "result" TEXT,
ADD COLUMN     "type" "TestType";
