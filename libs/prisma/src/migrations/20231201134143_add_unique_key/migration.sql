/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_key_key" ON "Link"("key");
