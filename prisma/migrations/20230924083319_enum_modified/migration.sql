/*
  Warnings:

  - The values [OnGoing] on the enum `SemesterRegistrationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SemesterRegistrationStatus_new" AS ENUM ('UpComing', 'OnGoning', 'Ended');
ALTER TABLE "semester_registrations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "semester_registrations" ALTER COLUMN "status" TYPE "SemesterRegistrationStatus_new" USING ("status"::text::"SemesterRegistrationStatus_new");
ALTER TYPE "SemesterRegistrationStatus" RENAME TO "SemesterRegistrationStatus_old";
ALTER TYPE "SemesterRegistrationStatus_new" RENAME TO "SemesterRegistrationStatus";
DROP TYPE "SemesterRegistrationStatus_old";
ALTER TABLE "semester_registrations" ALTER COLUMN "status" SET DEFAULT 'UpComing';
COMMIT;
