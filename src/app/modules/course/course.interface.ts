export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IpreRequisiteRequest[];
};

export type ICourseFilterRequest = {
  searchTerm?: string;
};

export type IpreRequisiteRequest = {
  courseId: string;
  isDeleted?: null;
};
