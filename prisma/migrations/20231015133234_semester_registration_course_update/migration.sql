/*
  Warnings:

  - The primary key for the `student_semester_registration_courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `SemisterRegistrationId` on the `student_semester_registration_courses` table. All the data in the column will be lost.
  - Added the required column `SemesterRegistrationId` to the `student_semester_registration_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_semester_registration_courses" DROP CONSTRAINT "student_semester_registration_courses_pkey",
DROP COLUMN "SemisterRegistrationId",
ADD COLUMN     "SemesterRegistrationId" TEXT NOT NULL,
ADD CONSTRAINT "student_semester_registration_courses_pkey" PRIMARY KEY ("SemesterRegistrationId", "studentId", "offeredCourseId");
