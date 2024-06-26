import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = Router();

router.get('/', StudentController.getAllFromDB);
router.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.myCourses
);
router.get(
  '/my-marks',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.getMyCourseMarks
);
router.get(
  '/my-courses-schedule',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.getMyCourseSchedule
);
router.get(
  '/my-academic-info',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.getMyAcademicInfo
);
router.get('/:id', StudentController.getDataById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentController.deleteDataById
);
router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentController.updateIntoDB
);
router.post(
  '/',
  validateRequest(StudentValidation.create),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT
  ),
  StudentController.insertIntoDB
);

export const StudentsRoutes = router;
