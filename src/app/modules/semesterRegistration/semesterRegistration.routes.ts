import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistrationValidation';

const router = Router();
router.get('/:id', SemesterRegistrationController.getDataById);
router.delete('/:id', SemesterRegistrationController.deleteDataById);
router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  SemesterRegistrationController.updateIntoDB
);
router.get('/', SemesterRegistrationController.getAllFromDB);
router.post(
  '/',
  validateRequest(SemesterRegistrationValidation.create),
  SemesterRegistrationController.insertIntoDB
);

export const SemesterRegistrationRoutes = router;
