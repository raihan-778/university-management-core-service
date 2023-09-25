import { Router } from 'express';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';

const router = Router();

router.post('/', OfferedCourseSectionController.insertIntoDB);

export const OfferedCourseSectionRoutes = router;
