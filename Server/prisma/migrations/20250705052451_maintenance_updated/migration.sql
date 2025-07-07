/*
  Warnings:

  - Made the column `status` on table `Maintenance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dueTo` on table `Maintenance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Maintenance" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "dueTo" SET NOT NULL;
