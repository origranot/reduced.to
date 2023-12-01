-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_linkId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
