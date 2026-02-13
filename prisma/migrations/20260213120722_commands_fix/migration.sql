/*
  Warnings:

  - You are about to drop the `Command` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommandItem" DROP CONSTRAINT "CommandItem_commandId_fkey";

-- DropTable
DROP TABLE "Command";

-- CreateTable
CREATE TABLE "Commands" (
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

    CONSTRAINT "Commands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Commands_order_id_key" ON "Commands"("order_id");

-- AddForeignKey
ALTER TABLE "CommandItem" ADD CONSTRAINT "CommandItem_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Commands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
