-- CreateTable
CREATE TABLE "WandTestResult" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "answers" JSONB NOT NULL,

    CONSTRAINT "WandTestResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WandTestResult" ADD CONSTRAINT "WandTestResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
