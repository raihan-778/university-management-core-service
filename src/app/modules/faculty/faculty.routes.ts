import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = Router();

router.get('/', FacultyController.getAllFromDB);
router.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.FACULTY),
  FacultyController.myCourses
);

router.get('/:id', FacultyController.getDataById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteDataById
);
router.patch(
  '/:id',
  validateRequest(FacultyValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.updateIntoDB
);
router.post(
  '/',
  validateRequest(FacultyValidation.create),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.insertIntoDB
);

router.post(
  '/:id/assign-courses',
  validateRequest(FacultyValidation.addOrRemoveCourses),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FacultyController.assignCoursesData
);
router.delete(
  '/:id/delete-courses',
  validateRequest(FacultyValidation.addOrRemoveCourses),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  // validateRequest(CourseValidation.create),
  FacultyController.DeleteCoursesData
);

export const FacultyRoutes = router;
