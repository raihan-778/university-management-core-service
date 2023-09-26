import { OfferedCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCoursFilterableFields } from './offeredCourse.constant';
import { OfferedCourseService } from './offeredCourse.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await OfferedCourseService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Created!',
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, OfferedCoursFilterableFields);
  const options = pick(req.query, paginationFields);

  // console.log('Filters:', filters);
  // console.log('Options:', options);
  const result = await OfferedCourseService.getAllFromDB(filters, options);
  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course data Fatched!!',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.getDataById(req.params.id);
  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Single data Fatched!!',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await OfferedCourseService.updateIntoDB(id, payload);
  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Data Updated Successfully!!',
    data: result,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseService.deleteDataById(id);
  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course Data Deleted Successfully!!',
    data: result,
  });
});

export const OfferedCourseController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
};
