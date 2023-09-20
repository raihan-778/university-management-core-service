import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CourseService } from './course.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.insertIntoDB(req.body);

  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Course Created Successfully',
  //     data: result,
  //   });
});

export const CourseController = {
  insertIntoDB,
};
