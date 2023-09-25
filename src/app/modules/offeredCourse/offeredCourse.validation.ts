import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'academicDepartmentId is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is required',
    }),
    courseIds: z.array(
      z.string({ required_error: 'Course Id isFiniteError' }),
      {
        required_error: 'Course Ids are Required',
      }
    ),
  }),
});
export const OfferedCourseValidation={
    create
}