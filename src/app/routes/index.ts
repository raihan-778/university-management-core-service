import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { BuildingRoutes } from '../modules/building/building.routes';
import { CourseRoutes } from '../modules/course/course.routes';
import { FacultyRoutes } from '../modules/faculty/faculty.routes';
import { OfferedCourseRouter } from '../modules/offeredCourse/offeredCourse.routes';
import { OfferedCourseSectionRoutes } from '../modules/offeredCourseSection/offeredCourseSection.routes';
import { RoomRoutes } from '../modules/room/room.routes';
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.routes';
import { OfferedCourseClassScheduleRoutes } from './../modules/offeredCourseClassSchedule/offeredCourseClassSchedule.routes';
import { StudentsRoutes } from './../modules/student/student.routes';
import { StudentEnrolledCourseMarkeRoutes } from './../modules/studentEnrolledCourseMarks/studentEnrolledCourseMarks.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    routes: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    routes: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    routes: AcademicDepartmentRoutes,
  },
  {
    path: '/students',
    routes: StudentsRoutes,
  },
  {
    path: '/faculties',
    routes: FacultyRoutes,
  },
  {
    path: '/buildings',
    routes: BuildingRoutes,
  },
  {
    path: '/rooms',
    routes: RoomRoutes,
  },
  {
    path: '/courses',
    routes: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    routes: SemesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    routes: OfferedCourseRouter,
  },
  {
    path: '/offered-course-sections',
    routes: OfferedCourseSectionRoutes,
  },
  {
    path: '/offered-course-class-schedules',
    routes: OfferedCourseClassScheduleRoutes,
  },
  {
    path: '/student-enrolled-course-marks',
    routes: StudentEnrolledCourseMarkeRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
