-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "shortenedUrl" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "expirationTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortenedUrl_key" ON "Url"("shortenedUrl");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
