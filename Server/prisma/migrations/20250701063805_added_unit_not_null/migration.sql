/*
  Warnings:

  - Made the column `unit` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "unit" SET NOT NULL;
