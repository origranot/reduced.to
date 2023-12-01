/*
  Warnings:

  - You are about to drop the column `key` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Report` table. All the data in the column will be lost.
  - Added the required column `linkId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Report_key_idx";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "key",
DROP COLUMN "url",
ADD COLUMN     "linkId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- CreateIndex
CREATE INDEX "Report_linkId_idx" ON "Report"("linkId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
