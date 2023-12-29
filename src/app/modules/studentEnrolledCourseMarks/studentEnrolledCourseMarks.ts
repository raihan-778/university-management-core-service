import {
  ExamType,
  Prisma,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { studentEnrolledCourseMarkUtils } from './studentEnrolledCourseMarks.utils';
import {
  IUpdateStudentCourseFinalMarksPayload,
  IUpdateStudentMarksPayload,
} from './studentEnrolledCourseMarsk.interface';

const getAllstudentEnrolledCourseMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,

  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  const whereConditions: Prisma.StudentEnrolledCourseMarkWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prismaClient.studentEnrolledCourseMark.findMany({
    where: whereConditions,
    // where: andConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.studentEnrolledCourseMark.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const createStudentEnrolledDefaultCoursMark = async (
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
  const isExistMidtermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistMidtermData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        examType: ExamType.MIDTERM,
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
      },
    });
  }

  const isExistFinalData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistFinalData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        examType: ExamType.FINAL,
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
      },
    });
  }
};
const updateStudentMarks = async (
  payload: IUpdateStudentMarksPayload
): Promise<StudentEnrolledCourseMark> => {
  console.log(payload);
  const { studentId, courseId, academicSemesterId, marks, examType } = payload;

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course marks not found'
    );
  }

  const result = studentEnrolledCourseMarkUtils.gradeFromMarks(marks);
  const updateStudentMark = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMarks.id,
    },
    data: {
      marks,
      grade: result.grade,
    },
  });
  return updateStudentMark;
};

const updateFinalMark = async (
  payload: IUpdateStudentCourseFinalMarksPayload
): Promise<StudentEnrolledCourse> => {
  const { studentId, courseId, academicSemesterId } = payload;

  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId,
      },
      course: {
        id: courseId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
    },
  });

  if (!studentEnrolledCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student Enrolled Course Data Not Found'
    );
  }
  //console.log(studentEnrolledCourse);
  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });

  console.log(studentEnrolledCourseMarks);
  if (!studentEnrolledCourseMarks?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student Enrolled Course Marks not Found'
    );
  }
  const midTermMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.MIDTERM)
      ?.marks || 0;
  const finalTermMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.FINAL)
      ?.marks || 0;

  console.log('m-', midTermMarks, 'f-', finalTermMarks);

  const finalTotalMarks =
    Math.ceil(midTermMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);
  const result = studentEnrolledCourseMarkUtils.gradeFromMarks(finalTotalMarks);

  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data: {
      grade: result.grade,
      point: result.point,
      totalMarks: finalTotalMarks,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledDefaultCoursMark,
  updateStudentMarks,
  updateFinalMark,
};
