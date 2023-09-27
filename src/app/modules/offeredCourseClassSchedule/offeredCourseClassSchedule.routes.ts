import { Router } from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';

const router = Router();
router.get('/', OfferedCourseClassScheduleController.getAllFromDB);
router.post('/', OfferedCourseClassScheduleController.insertIntoDB);

export const OfferedCourseClassScheduleRoutes = router;
