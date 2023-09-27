import { WeekDays } from '@prisma/client';

export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const hasTimeConflict = (
  existingSlot: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }[],
  newSlot: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }
) => {
  for (const slot of existingSlot) {
    const existingStart = new Date(`2023-09-01 ${slot.startTime}:00`);
    const existingEnd = new Date(`2023-09-01 ${slot.endTime}:00`);
    const newStart = new Date(`2023-09-01 ${newSlot.startTime}:00`);
    const newEnd = new Date(`2023-09-01 ${newSlot.endTime}:00`);
    console.log(existingStart);
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }
  return false;
};
