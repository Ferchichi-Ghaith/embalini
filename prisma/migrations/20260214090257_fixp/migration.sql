/*
  Warnings:

  - You are about to drop the column `etat` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "etat",
DROP COLUMN "subtitle";
