/*
  Warnings:

  - Added the required column `date` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_REVIEW', 'CONFIRMED', 'SHIPPED', 'CANCELLED');

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "date" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Command" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "secret_code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "message" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_estimation" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TND',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandItem" (
    "id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,
    "prix_total" DECIMAL(10,2) NOT NULL,
    "productimage" TEXT NOT NULL,
    "commandId" TEXT NOT NULL,

    CONSTRAINT "CommandItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Command_order_id_key" ON "Command"("order_id");

-- AddForeignKey
ALTER TABLE "CommandItem" ADD CONSTRAINT "CommandItem_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;
