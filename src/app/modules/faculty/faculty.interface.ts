export type IFacultyFilterRequest = {
  searchTerm?: string;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
};

export type IFacultyCourseStudentRequest = {
  academicSemesterId?: string | null | undefined;
  courseId?: string;
  offeredCourseSectionId?: string;
};
