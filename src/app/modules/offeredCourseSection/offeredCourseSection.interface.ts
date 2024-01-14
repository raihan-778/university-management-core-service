import { WeekDays } from '@prisma/client';

export type IOfferedCourseSectionFilterRequest = {
  searchTerm?: string;
};
export type IOfferedCourseSectionCreate = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  currentlyEnrolledStudent: number;
  classSchedules: IClassSchedule[];
};

export type IClassSchedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
  facultyId: string;
  roomId: string;
};
