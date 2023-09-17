import { Student } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (studentData: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: studentData,
  });
  return result;
};

export const StudentService = {
  insertIntoDB,
};
