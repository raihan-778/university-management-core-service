import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    code: z.string({
      required_error: 'Code is required',
    }),
    credits: z.number({
      required_error: 'Credites is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().optional(),
  }),
});

export const CourseValidation = {
  create,
  update,
};