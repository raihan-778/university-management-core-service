export type IFacultyFilterRequest = {
  searchTerm?: string;
};

export type IFacultyCourseStudentRequest = {
  academicSemesterId?: string | null | undefined;
  courseId?: string;
  offeredCourseSectionId?: string;
};
