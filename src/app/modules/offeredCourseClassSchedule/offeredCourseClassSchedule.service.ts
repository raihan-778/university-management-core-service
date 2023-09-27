import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  OfferedCourseClassScheduleRelationalFields,
  OfferedCourseClassScheduleRelationalFieldsMapper,
  OfferedCourseClassScheduleSearchableFields,
} from './offeredCourseClassSchedule.constant';
import { IOfferedCourseClassScheduleFilterRequest } from './offeredCourseClassSchedule.interface';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

const insertIntoDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkRoomAvailability(data);
  await OfferedCourseClassScheduleUtils.checkFacultyAvailability(data);

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      offeredCourseSection: true,
      semesterRegistration: true,
      faculty: true,
      room: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseClassScheduleFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  const { searchTerm, ...filterData } = filters;
  // console.log('ac_service', searchTerm);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  console.log(filters);
  const andConditions = [];
  console.log(options);

  if (searchTerm) {
    andConditions.push({
      OR: OfferedCourseClassScheduleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (OfferedCourseClassScheduleRelationalFields.includes(key)) {
          return {
            [OfferedCourseClassScheduleRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
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
      semesterRegistration: true,
      room: true,
      faculty: true,
      offeredCourseSection: true,
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
export const OfferedCourseClassScheduleService = {
  insertIntoDB,
  getAllFromDB,
};
