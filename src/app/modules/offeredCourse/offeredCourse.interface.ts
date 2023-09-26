export type IOfferedCourseType = {
  courseIds: string[];
  academicDepartmentId: string;
  semesterRegistrationId: string;
};
export type IOfferedCourseFilterRequest = {
  searchTerm?: string;
};
