import { Course, CourseFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { CourseSearchableFields } from './course.constant';
import {
  ICourseCreateData,
  ICourseFilterRequest,
  IpreRequisiteRequest,
} from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transectionClient => {
    const result = await transectionClient.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Course creation failed');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IpreRequisiteRequest) => {
          const createPrerequisite =
            await transectionClient.courseToPrerequisits.create({
              data: {
                courseId: result.id,
                prerequisitesId: preRequisiteCourse.courseId,
              },
            });
          console.log(createPrerequisite);
        }
      );
    }

    return result;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        prerequisits: {
          include: {
            prerequisites: true,
          },
        },
        prerequisitsFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Course creation failed');
};

const getAllFromDB = async (
  filters: ICourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { searchTerm, ...filterData } = filters;
  // console.log('ac_service', searchTerm);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  console.log(filters);
  const andConditions = [];
  console.log(options);

  if (searchTerm) {
    andConditions.push({
      OR: CourseSearchableFields.map(field => ({
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
  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.course.findMany({
    where: whereConditions,
    include: {
      prerequisits: {
        include: {
          prerequisites: true,
        },
      },
      prerequisitsFor: {
        include: {
          course: true,
        },
      },
    },
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
  const total = await prisma.course.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ICourseCreateData>
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;

  await prisma.$transaction(async transectionClient => {
    const result = await transectionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisite = preRequisiteCourses.filter(
        deletePrerequisite =>
          deletePrerequisite.courseId && deletePrerequisite.isDeleted
      );
      const newPrerequisite = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && !coursePrerequisite.isDeleted
      );
      await asyncForEach(
        deletePrerequisite,
        async (deletePreRequisiteCourse: IpreRequisiteRequest) => {
          await transectionClient.courseToPrerequisits.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  prerequisitesId: deletePreRequisiteCourse.courseId,
                },
              ],
            },
          });
        }
      );

      await asyncForEach(
        newPrerequisite,
        async (createPreRequisiteCourse: IpreRequisiteRequest) => {
          await transectionClient.courseToPrerequisits.create({
            data: {
              courseId: id,
              prerequisitesId: createPreRequisiteCourse.courseId,
            },
            include: {
              prerequisites: true,
            },
          });
        }
      );
    }
    return result;
  });

  const responseData = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      prerequisits: {
        include: {
          prerequisites: true,
        },
      },
      prerequisitsFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return responseData;
};

// return result;

const deleteDataById = async (id: string): Promise<Course> => {
  const result = await prisma.course.delete({
    where: {
      id,
    },
  });
  return result;
};

const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId: facultyId,
    })),
  });

  const assignFacultyData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultyData;
};

const DeleteFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });

  const assignFacultyData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultyData;
};

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
  assignFaculties,
  DeleteFaculties,
};
