import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { OfferedCourseClassSchedule } from '@prisma/client';
import { OfferedCoursClassScheduleFilterableFields } from './offeredCourseClassSchedule.constant';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseClassScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Class Schedule Created!!',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, OfferedCoursClassScheduleFilterableFields);
  const options = pick(req.query, paginationFields);

  // console.log('Filters:', filters);
  // console.log('Options:', options);
  const result = await OfferedCourseClassScheduleService.getAllFromDB(
    filters,
    options
  );
  sendResponse<OfferedCourseClassSchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Class Schedule data Fatched!!',
    meta: result.meta,
    data: result.data,
  });
});

export const OfferedCourseClassScheduleController = {
  insertIntoDB,
  getAllFromDB,
};
