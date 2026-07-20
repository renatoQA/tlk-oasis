-- CreateEnum
CREATE TYPE "PixKeyType" AS ENUM ('CPF', 'PHONE', 'RANDOM', 'EMAIL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pixKey" TEXT,
ADD COLUMN     "pixKeyType" "PixKeyType";

