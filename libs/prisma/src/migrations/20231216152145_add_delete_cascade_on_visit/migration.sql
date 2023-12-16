-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_linkId_fkey";

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
