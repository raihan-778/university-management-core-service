import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { FacultyService } from './faculty.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.insertIntoDB(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Enrolled!!',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const options = pick(req.query, paginationFields);

  // console.log('Filters:', filters);
  // console.log('Options:', options);
  const result = await FacultyService.getAllFromDB(filters, options);
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty data Fatched!!',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getDataById(req.params.id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Single data Fatched!!',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await FacultyService.updateIntoDB(id, payload);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Data Updated Successfully!!',
    data: result,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.deleteDataById(id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Data Deleted Successfully!!',
    data: result,
  });
});

// Assign Courses to Faculty Controller.
const assignCoursesData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body.courses);
  const result = await FacultyService.assignCourses(id, req.body.courses);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses Assigned Successfully!!',
    data: result,
  });
});

//Delete Courses from Faculty Controller
const DeleteCoursesData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body.faculties);
  const result = await FacultyService.DeleteCourses(id, req.body.courses);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses Deleted Successfully!!',
    data: result,
  });
});

export const FacultyController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
  assignCoursesData,
  DeleteCoursesData,
};
