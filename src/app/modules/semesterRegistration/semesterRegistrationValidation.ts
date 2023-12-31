import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
  body: z.object({
    startDate: z.string({ required_error: 'Start Date is required' }),
    endDate: z.string({ required_error: 'End Date is required' }),
    minCredit: z.number({ required_error: 'Min Credit is required' }),
    maxCredit: z.number({ required_error: 'Max Credit is required' }),
    academicSemesterId: z.string({
      required_error: 'Academic Semester Id is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    status: z
      .enum([...Object.values(SemesterRegistrationStatus)] as [
        string,
        ...string[]
      ])
      .optional(),
    academicSemesterId: z.string().optional(),
  }),
});

const enrollOrWithdrawCourse = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: 'Offered Course Id is required',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered Course Section Id is required',
    }),
  }),
});

export const SemesterRegistrationValidation = {
  create,
  update,
  enrollOrWithdrawCourse,
};
