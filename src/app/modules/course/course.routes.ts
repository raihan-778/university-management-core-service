import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = Router();

router.get('/', CourseController.getAllFromDB);
router.get('/:id', CourseController.getDataById);
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CourseValidation.create),
  CourseController.insertIntoDB
);
router.post(
  '/:id/assign-faculties',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN)
  // validateRequest(CourseValidation.create),
  // CourseController.insertIntoDB
);
router.patch(
  '/:id',

  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CourseValidation.update),
  CourseController.updateIntoDB
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.deleteDataById
);

router.post(
  '/:id/assign-faculties',

  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CourseValidation.addOrRemoveFaculties),
  CourseController.assignFacultiesData
);
router.delete(
  '/:id/delete-faculties',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CourseValidation.addOrRemoveFaculties),
  CourseController.DeleteFacultiesData
);

export const CourseRoutes = router;
