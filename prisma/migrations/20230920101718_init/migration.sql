/*
  Warnings:

  - You are about to drop the `Building` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_buildingId_fkey";

-- DropTable
DROP TABLE "Building";

-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buildingId" TEXT NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coursesToPrerequisits" (
    "courseId" TEXT NOT NULL,
    "prerequisitesId" TEXT NOT NULL,

    CONSTRAINT "coursesToPrerequisits_pkey" PRIMARY KEY ("courseId","prerequisitesId")
);

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coursesToPrerequisits" ADD CONSTRAINT "coursesToPrerequisits_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coursesToPrerequisits" ADD CONSTRAINT "coursesToPrerequisits_prerequisitesId_fkey" FOREIGN KEY ("prerequisitesId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
