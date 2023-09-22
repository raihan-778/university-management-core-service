-- CreateTable
CREATE TABLE "CourseFaculty" (
    "courseId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "CourseFaculty_pkey" PRIMARY KEY ("courseId","facultyId")
);

-- AddForeignKey
ALTER TABLE "CourseFaculty" ADD CONSTRAINT "CourseFaculty_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseFaculty" ADD CONSTRAINT "CourseFaculty_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
