import { PrismaClient } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';

const createSemesterPayment = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
) => {
  const dataToInsert = {
    studentId: payload.studentId,
    academicSemesterId: payload.academicSemesterId,
    fullPaymentAmount: payload.totalPaymentAmount,
    partialPaymentAmount: payload.totalPaymentAmount,
    totalDueAmount: payload.totalPaymentAmount,
    totalPaidAmount: 0,
  };

  await prismaClient.studentSemesterPayment.create({
    data: dataToInsert,
  });
};

export const StudentSemesterPaymentService = {
  createSemesterPayment,
};
