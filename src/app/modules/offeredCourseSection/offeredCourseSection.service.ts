import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { OfferedCourseSectionSearchableFields } from './offeredCourseSection.constant';
import { IOfferedCourseSectionFilterRequest } from './offeredCourseSection.interface';

const insertIntoDB = async (
  data: OfferedCourseSection
): Promise<OfferedCourseSection> => {
  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });
  console.log(isExistOfferedCourse);
  console.log('data:', data);
  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found');
  }

  data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;
  const result = await prisma.offeredCourseSection.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseSectionFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { searchTerm, ...filterData } = filters;
  // console.log('ac_service', searchTerm);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  console.log(filters);
  const andConditions = [];
  console.log(options);

  if (searchTerm) {
    andConditions.push({
      OR: OfferedCourseSectionSearchableFields.map(field => ({
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
  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.offeredCourseSection.findMany({
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
  const total = await prisma.offeredCourseSection.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};

const deleteDataById = async (id: string): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById
};
