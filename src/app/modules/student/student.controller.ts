import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentFilterableFields } from './student.constant';
import { StudentService } from './student.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.insertIntoDB(req.body);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Enrolled!!',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, StudentFilterableFields);
  const options = pick(req.query, paginationFields);

  // console.log('Filters:', filters);
  // console.log('Options:', options);
  const result = await StudentService.getAllFromDB(filters, options);
  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data Fatched!!',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getDataById(req.params.id);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Single data Fatched!!',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await StudentService.updateIntoDB(id, payload);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Data Updated Successfully!!',
    data: result,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.deleteDataById(id);
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Data Deleted Successfully!!',
    data: result,
  });
});
const myCourses = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['academicSemesterId', 'courseId']);
  const user = (req as any).user;

  const result = await StudentService.myCourses(user.userId, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Course Data retrived Successfully!!',
    data: result,
  });
});
const getMyCourseSchedule = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['academicSemesterId', 'courseId']);
  const user = (req as any).user;

  const result = await StudentService.getMyCourseSchedule(user.userId, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Course Schedule Data retrived Successfully!!',
    data: result,
  });
});
const getMyAcademicInfo = catchAsync(async (req: Request, res: Response) => {
  
  const user = (req as any).user;

  const result = await StudentService.getMyAcademicInfo(user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' My Academic Info retrived Successfully!!',
    data: result,
  });
});
const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
  
  const filter = pick(req.query, ['academicSemesterId', 'courseId']);
  const user = (req as any).user;
  const result = await StudentService.getMyCourseMarks(user.userId,filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' My Course Marks Data retrived Successfully!!',
    data: result,
  });
});

export const StudentController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
  myCourses,
  getMyCourseSchedule,
  getMyAcademicInfo,
  getMyCourseMarks
};
