import { ExamType, PrismaClient } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';

const studentEnrolledDefaultCoursMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  console.log('Student Default Cours Mark', payload);

  await prismaClient.studentEnrolledCourseMark.create({
    data: {
      student: {
        connect: {
          id: payload.studentId,
        },
      },
      studentEnrolledCourse: {
        connect: {
          id: payload.studentEnrolledCourseId,
        },
      },
      academicSemester: {
        connect: {
          id: payload.academicSemesterId,
        },
      },
      examType: ExamType.MIDTERM,
    },
  });
  await prismaClient.studentEnrolledCourseMark.create({
    data: {
      student: {
        connect: {
          id: payload.studentId,
        },
      },
      studentEnrolledCourse: {
        connect: {
          id: payload.studentEnrolledCourseId,
        },
      },
      academicSemester: {
        connect: {
          id: payload.academicSemesterId,
        },
      },
      examType: ExamType.FINAL,
    },
  });
};

export const StudentEnrolledCourseMarkService = {
  studentEnrolledDefaultCoursMark,
};
