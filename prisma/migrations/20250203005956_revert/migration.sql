/*
  Warnings:

  - You are about to drop the `WandTestResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WandTestResult" DROP CONSTRAINT "WandTestResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "testResult" DROP CONSTRAINT "testResult_userId_fkey";

-- DropTable
DROP TABLE "WandTestResult";

-- DropTable
DROP TABLE "testResult";

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "houseResult" TEXT NOT NULL,
    "answer" TEXT,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
