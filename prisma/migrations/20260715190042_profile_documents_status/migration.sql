-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "contractSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contractSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "nick" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "shirtReceived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shirtRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shirtSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shirtSize" TEXT;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

