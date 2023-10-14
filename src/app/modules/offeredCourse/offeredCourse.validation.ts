import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'academicDepartmentId is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is required',
    }),
    courseIds: z.array(z.string({ required_error: 'Course Id is Required' }), {
      required_error: 'Course Ids are Required',
    }),
  }),
});
const update = z.object({
  body: z.object({
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    courseIds: z.optional(
      z.array(z.string(), {
        required_error: 'Course Ids are Required',
      })
    ),
  }),
});
export const OfferedCourseValidation = {
  create,
  update,
};
