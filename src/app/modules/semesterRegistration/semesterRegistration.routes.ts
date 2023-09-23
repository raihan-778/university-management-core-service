import { Router } from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = Router();
router.post('/', SemesterRegistrationController.insertIntoDB);

export const SemesterRegistrationRoutes = router;
