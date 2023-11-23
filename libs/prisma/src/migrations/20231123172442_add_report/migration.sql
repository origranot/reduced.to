-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_key_idx" ON "Report"("key");

-- CreateIndex
CREATE INDEX "Report_category_idx" ON "Report"("category");
