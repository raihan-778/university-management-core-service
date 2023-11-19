import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from './../../../enums/user';
import { SemesterRegistrationController } from './semesterRegistration.controller';

import { SemesterRegistrationValidation } from './semesterRegistrationValidation';

const router = Router();
router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMyRegistration
);
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
router.post(
  '/enroll-into-course',
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),

  SemesterRegistrationController.enrollIntoCourse
);
router.post(
  '/withdraw-from-course',
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  auth(ENUM_USER_ROLE.STUDENT),

  SemesterRegistrationController.withdrawFromCourse
);
router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),

  SemesterRegistrationController.confirmMyRegistration
);
router.post(
  '/:id/start-new-semester',
  auth(ENUM_USER_ROLE.ADMIN),

  SemesterRegistrationController.startNewSemester
);

export const SemesterRegistrationRoutes = router;
