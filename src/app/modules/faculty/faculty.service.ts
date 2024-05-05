import { CourseFaculty, Faculty, Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { FacultySearchableFields } from './faculty.constant';
import {
  IFacultyCourseStudentRequest,
  IFacultyFilterRequest,
} from './faculty.interface';

const insertIntoDB = async (facultyData: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: facultyData,
  });
  return result;
};

const getAllFromDB = async (
  filters: IFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filterData } = filters;
  // console.log('ac_service', searchTerm);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  console.log(filters);
  const andConditions = [];
  console.log(options);

  if (searchTerm) {
    andConditions.push({
      OR: FacultySearchableFields.map(field => ({
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
  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.faculty.findMany({
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
      academicFaculty: true,
      academicDepartment: true,
      offeredCourseClassSchedules: true,
    },
  });
  const total = await prisma.student.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const deleteDataById = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// assign Courses into Course Route

const assignCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId: courseId,
    })),
  });

  const assignCourseData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignCourseData;
};

// Remove Courses from Course Route

const DeleteCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  const assignCourseData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignCourseData;
};

const myCourses = async (
  authUser: {
    userId: string;
    role: string;
  },
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentSemester?.id;
  }
  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUser.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedules = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;
      // console.log('class-Schedule:', classSchedules);

      const existingCourse = acc.find(
        (item: any) => item.course?.id === course?.id
      );
      // console.log('existingCourse:', existingCourse);
      if (existingCourse) {
        acc.sections?.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc?.push({
          course,
          setions: {
            section: obj,
            classSchedules,
          },
        });
      }
      // console.log('ACC', acc);
      return acc;
    },
    []
  );

  return courseAndSchedules;
};
const myCourseStudents = async (
  authUser: any,
  filter: IFacultyCourseStudentRequest,
  options: IPaginationOptions
): Promise<Student[]> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  console.log(authUser);
  if (!filter.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentAcademicSemester?.id;
  }
  const offeredCourseSections =
    await prisma.studentSemesterRegistrationsCourse.findMany({
      where: {
        offeredCourse: {
          course: {
            id: filter.courseId,
          },
        },
        offeredCourseSection: {
          offeredCourse: {
            semesterRegistration: {
              academicSemester: {
                id: filter.academicSemesterId,
              },
            },
          },
          id: filter.offeredCourseSectionId,
        },
      },
      include: {
        student: true,
      },
      take: limit,
      skip,
    });

  const students = offeredCourseSections.map(
    offeredCourseSection => offeredCourseSection.student
  );

  const total = await prisma.studentSemesterRegistrationsCourse.count({
    where: {
      offeredCourse: {
        course: {
          id: filter.courseId,
        },
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filter.academicSemesterId,
            },
          },
        },
        id: filter.offeredCourseSectionId,
      },
    },
  });

  console.log(total);

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: students,
  };
};

export const FacultyService = {
  myCourses,
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
  assignCourses,
  DeleteCourses,
  myCourseStudents,
};
