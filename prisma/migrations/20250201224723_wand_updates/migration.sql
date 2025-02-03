/*
  Warnings:

  - You are about to drop the column `answers` on the `WandTestResult` table. All the data in the column will be lost.
  - Added the required column `answer` to the `WandTestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `WandTestResult` table without a default value. This is not possible if the table is not empty.
  - Made the column `result` on table `WandTestResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WandTestResult" DROP COLUMN "answers",
ADD COLUMN     "answer" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "result" SET NOT NULL;
