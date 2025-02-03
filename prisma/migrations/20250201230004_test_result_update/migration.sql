/*
  Warnings:

  - You are about to drop the `HouseTestResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HouseTestResult" DROP CONSTRAINT "HouseTestResult_userId_fkey";

-- DropTable
DROP TABLE "HouseTestResult";

-- CreateTable
CREATE TABLE "testResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "answer" JSONB NOT NULL,

    CONSTRAINT "testResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "testResult" ADD CONSTRAINT "testResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
