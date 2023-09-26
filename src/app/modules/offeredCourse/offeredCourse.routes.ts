import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';

const router = Router();

router.get('/', OfferedCourseController.getAllFromDB);
router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseValidation.create),
  OfferedCourseController.insertIntoDB
);
router.get('/:id', OfferedCourseController.getDataById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),

  OfferedCourseController.deleteDataById
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseValidation.update),
  OfferedCourseController.updateIntoDB
);

export const OfferedCourseRouter = router;
