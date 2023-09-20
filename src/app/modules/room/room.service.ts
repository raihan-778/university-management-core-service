import { Room } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (roomData: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data: roomData,
    include: {
      building: true,
    },
  });
  return result;
};
export const RoomService = {
  insertIntoDB,
};
