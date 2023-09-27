import { SemesterRegistrationController } from './semesterRegistration.controller';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from './../../../enums/user';

import { SemesterRegistrationValidation } from './semesterRegistrationValidation';

const router = Router();
router.get('/:id', SemesterRegistrationController.getDataById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SemesterRegistrationController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.update),
  SemesterRegistrationController.updateIntoDB
);
router.get('/', SemesterRegistrationController.getAllFromDB);
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.create),
  SemesterRegistrationController.insertIntoDB
);
router.post(
  '/student-registration',
  auth(ENUM_USER_ROLE.STUDENT),

  SemesterRegistrationController.startMyRegistration
);

export const SemesterRegistrationRoutes = router;
