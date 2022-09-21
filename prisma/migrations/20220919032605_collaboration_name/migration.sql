/*
  Warnings:

  - Added the required column `name` to the `Collaboration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collaboration" ADD COLUMN     "name" TEXT NOT NULL;
