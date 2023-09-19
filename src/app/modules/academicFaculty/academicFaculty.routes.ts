import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = Router();
router.get('/', AcademicFacultyController.getAllFromDB);
router.get('/:id', AcademicFacultyController.getDataById);

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicFacultyValidation.create),
  AcademicFacultyController.insertIntoDB
);

export const AcademicFacultyRoutes = router;
