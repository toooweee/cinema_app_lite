/*
  Warnings:

  - Added the required column `dissimal_date` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employment_date` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "dissimal_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "employment_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
