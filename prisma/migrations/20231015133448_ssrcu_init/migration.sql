/*
  Warnings:

  - The primary key for the `student_semester_registration_courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `SemesterRegistrationId` on the `student_semester_registration_courses` table. All the data in the column will be lost.
  - Added the required column `semesterRegistrationId` to the `student_semester_registration_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_semester_registration_courses" DROP CONSTRAINT "student_semester_registration_courses_pkey",
DROP COLUMN "SemesterRegistrationId",
ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL,
ADD CONSTRAINT "student_semester_registration_courses_pkey" PRIMARY KEY ("semesterRegistrationId", "studentId", "offeredCourseId");

-- AddForeignKey
ALTER TABLE "student_semester_registration_courses" ADD CONSTRAINT "student_semester_registration_courses_semesterRegistration_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
