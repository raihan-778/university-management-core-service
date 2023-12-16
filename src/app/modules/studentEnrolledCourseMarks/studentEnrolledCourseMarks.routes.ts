import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMarks.controller';

const router = express.Router();
router.patch(
  '/update-mark',
  StudentEnrolledCourseMarkController.updateStudentMarks
);

export const StudentEnrolledCourseMarkeRoutes = router;
