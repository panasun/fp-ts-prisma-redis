-- CreateEnum
CREATE TYPE "AccountStatusEnum" AS ENUM ('PENDING', 'APPROVE', 'TERMINATE', 'REJECT');

-- CreateEnum
CREATE TYPE "AccountAuthMethodEnum" AS ENUM ('FACEBOOK', 'GOOGLE', 'EMAIL', 'LINE', 'PHONE');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "status" "AccountStatusEnum" NOT NULL DEFAULT 'PENDING',
    "uuid" TEXT NOT NULL,
    "authMethod" "AccountAuthMethodEnum" NOT NULL DEFAULT 'FACEBOOK',
    "userName" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "walletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountId_key" ON "Account"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_uuid_key" ON "Account"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userName_key" ON "Account"("userName");
