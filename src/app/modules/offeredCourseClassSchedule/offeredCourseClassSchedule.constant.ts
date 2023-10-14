export const OfferedCoursClassScheduleFilterableFields = [
  'searchTerm',
  'dayOfWeek',
  'offeredCourseSectionId',

  'semesterRegistrationId',
  'facultyId',
  'roomId',
];

export const OfferedCourseClassScheduleSearchableFields = ['dayOfWeek'];
export const OfferedCourseClassScheduleRelationalFields = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId',
];

export const OfferedCourseClassScheduleRelationalFieldsMapper: {
  [key: string]: string;
} = {
  offeredCourseSectionId: 'offeredCourseSection',
  semesterRegistrationId: 'semesterRegistration',
  facultyId: 'faculty',
  roomId: 'room',
};
