/*
  Warnings:

  - You are about to drop the `TestResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_userId_fkey";

-- DropTable
DROP TABLE "TestResult";

-- DropEnum
DROP TYPE "TestType";

-- CreateTable
CREATE TABLE "HouseTestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "result" TEXT,
    "answers" JSONB,

    CONSTRAINT "HouseTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WandTestResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "result" TEXT,
    "answers" JSONB,

    CONSTRAINT "WandTestResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HouseTestResult" ADD CONSTRAINT "HouseTestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WandTestResult" ADD CONSTRAINT "WandTestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
