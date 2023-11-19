import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, SemesterRegistrationFilterableFields);
  const options = pick(req.query, paginationFields);

  // console.log('Filters:', filters);
  // console.log('Options:', options);
  const result = await SemesterRegistrationService.getAllFromDB(
    filters,
    options
  );
  sendResponse<SemesterRegistration[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration data Fatched!!',
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.getDataById(req.params.id);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Single data Fatched!!',
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SemesterRegistrationService.updateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Data Updated Successfully!!',
    data: result,
  });
});

const deleteDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.deleteDataById(id);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Data Deleted Successfully!!',
    data: result,
  });
});

const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  // console.log(user);
  const result = await SemesterRegistrationService.startMyRegistration(
    user.userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Semester Registration Started Successfully!!',
    data: result,
  });
});

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SemesterRegistrationService.enrollIntoCourse(
    user.userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Enrollment Successfull!!',
    data: result,
  });
});
const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SemesterRegistrationService.withdrawFromCourse(
    user.userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw From Course Successfully!!',
    data: result,
  });
});
const confirmMyRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.confirmMyRegistration(
      user.userId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration Confirmed!!',
      data: result,
    });
  }
);
const getMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SemesterRegistrationService.getMyRegistration(
    user.userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Registration data retrived successfully!!',
    data: result,
  });
});
const startNewSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.startNewSemester(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Started Successfully!!',
    data: result,
  });
});
export const SemesterRegistrationController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateIntoDB,
  deleteDataById,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
};
