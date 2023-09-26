import { OfferedCourse, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { OfferedCourseSearchableFields } from './offeredCourse.constant';
import {
  IOfferedCourseFilterRequest,
  IOfferedCourseType,
} from './offeredCourse.interface';

const insertIntoDB = async (
  data: IOfferedCourseType
): Promise<OfferedCourse> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
  console.log('acdID', academicDepartmentId);
  const result: any = [];
  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });
    if (!alreadyExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          academicDepartment: true,
          semesterRegistration: true,
          course: true,
        },
      });
      result.push(insertOfferedCourse);
    }
  });
  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  const { searchTerm, ...filterData } = filters;
  // console.log('ac_service', searchTerm);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  console.log(filters);
  const andConditions = [];
  console.log(options);

  if (searchTerm) {
    andConditions.push({
      OR: OfferedCourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.OfferedCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.offeredCourse.findMany({
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
    include: {
      academicDepartment: true,
      course: true,
      semesterRegistration: true,
    },
  });
  const total = await prisma.offeredCourse.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<OfferedCourse>
): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id,
    },
    data: payload,
    include: {
      course: true,
      academicDepartment: true,
      semesterRegistration: true,
    },
  });
  return result;
};

const deleteDataById = async (id: string): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id,
    },
    include: {
      course: true,
      academicDepartment: true,
      semesterRegistration: true,
    },
  });
  return result;
};

export const OfferedCourseService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
};
