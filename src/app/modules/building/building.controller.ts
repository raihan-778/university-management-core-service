import { Building } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { buildingFilterableFields } from './building.constant';
import { BuildingService } from './building.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.insertIntoDB(req.body);
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building Created successfully',
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query);
  const filters = pick(req.query, buildingFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await BuildingService.getAllFromDB(filters, options);
  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building data fatched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const BuildingController = {
  insertIntoDB,
  getAllFromDB,
};
