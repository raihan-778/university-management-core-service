import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = Router();

router.post(
  '/',
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDB
);

export const StudentsRoutes = router;
