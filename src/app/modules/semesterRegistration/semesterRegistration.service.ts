import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ISemesterRegistrationFilterRequest } from './semesterRegistration.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { SemesterRegistrationSearchableFields } from './semesterRegistration.constant';

const insertIntoDB = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegUpcomminOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.OnGoning,
          },
          {
            status: SemesterRegistrationStatus.UpComing,
          },
        ],
      },
    });

  if (isAnySemesterRegUpcomminOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already an ${isAnySemesterRegUpcomminOrOngoing.status} Semester Registration`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { searchTerm, ...filterData } = filters;
  // console.log('ac_service', searchTerm);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  console.log(filters);
  const andConditions = [];
  console.log(options);

  if (searchTerm) {
    andConditions.push({
      OR: SemesterRegistrationSearchableFields.map(field => ({
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
  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.semesterRegistration.findMany({
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
  const total = await prisma.semesterRegistration.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
export const SemesterRegistrationService = {
  insertIntoDB,
};
