/*
  Warnings:

  - A unique constraint covering the columns `[secret_code]` on the table `Commands` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Commands_secret_code_key" ON "Commands"("secret_code");
