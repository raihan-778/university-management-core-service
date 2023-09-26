import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCoursSectionFilterableFields } from './offeredCourseSection.constant';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseSectionService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section Created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, OfferedCoursSectionFilterableFields);
  const options = pick(req.query, paginationFields);

  // console.log('Filters:', filters);
  // console.log('Options:', options);
  const result = await OfferedCourseSectionService.getAllFromDB(
    filters,
    options
  );
  sendResponse<OfferedCourseSection[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section data Fatched!!',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseSectionService.getDataById(req.params.id);
  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section Single data Fatched!!',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await OfferedCourseSectionService.updateIntoDB(id, payload);
  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section Data Updated Successfully!!',
    data: result,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.deleteDataById(id);
  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course Section Data Deleted Successfully!!',
    data: result,
  });
});
export const OfferedCourseSectionController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
};
