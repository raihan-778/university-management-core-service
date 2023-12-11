/*
  Warnings:

  - You are about to drop the column `poing` on the `student_enrolled_courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_enrolled_courses" DROP COLUMN "poing",
ADD COLUMN     "point" DOUBLE PRECISION DEFAULT 0;
