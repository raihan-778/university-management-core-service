import { z } from 'zod';

const create = z.object({
  body: z.object({
    studentId: z.string({ required_error: 'Student Id is required' }),
    firstName: z.string({ required_error: 'First Name is required' }),
    middleName: z.string().optional(),
    lastName: z.string({ required_error: 'Last Name is required' }),
    porfileImage: z.string({ required_error: 'Profile Image is required' }),
    email: z.string({ required_error: 'First Name is required' }),
    contactNo: z.string({ required_error: 'Contact no is required' }),
    gender: z.string({ required_error: 'Gender is required' }),
    bloodGroup: z.string({ required_error: 'Blood group is required' }),
    academicSemesterId: z.string({
      required_error: 'Academic Semester Id is required',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic Faculty Id is required',
    }),
    academicDepartmentId: z.string({
      required_error: 'Academic Department Id is required',
    }),
  }),
});

export const StudentValidation = {
  create,
};
