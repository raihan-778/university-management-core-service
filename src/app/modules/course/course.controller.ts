import { Course } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CourseFilterableFields } from './course.constant';
import { CourseService } from './course.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Created Successfully',
    data: result,
  });
});
//Get All Data Controller
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query);
  const filters = pick(req.query, CourseFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await CourseService.getAllFromDB(filters, options);
  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course data fatched successfully',
    meta: result.meta,
    data: result.data,
  });
});
//get data by Id controller
const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getDataById(req.params.id);
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Single data Fatched!!',
    data: result,
  });
});

//Update data by Id Controller
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.updateIntoDB(id, req.body);
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Data Updated Successfully!!',
    data: result,
  });
});
// Delete data by Id Controller
const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.deleteDataById(id);
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Data Deleted Successfully!!',
    data: result,
  });
});

// Assign Faculties Controller.
const assignFacultiesData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body.faculties);
  const result = await CourseService.assignFaculties(id, req.body.faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Assigned Successfully!!',
    data: result,
  });
});

//Delete Faculties Controller
const DeleteFacultiesData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body.faculties);
  const result = await CourseService.DeleteFaculties(id, req.body.faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Deleted Successfully!!',
    data: result,
  });
});

export const CourseController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
  assignFacultiesData,
  DeleteFacultiesData,
};
