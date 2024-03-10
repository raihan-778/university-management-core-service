const getAvailableCourses = (
  studentCompletedCourse: any,
  studentCurrentSemesterTakenCourse: any,
  offeredCourses: any
) => {
  const completedCourseId = studentCompletedCourse.map(
    (course: any) => course.courseId
  );

  const availableCoursesList = offeredCourses
    .filter(
      (offeredCourse: any) =>
        !completedCourseId?.includes(offeredCourse.courseId)
    )
    .filter((course: any) => {
      const preRequisites = course.course.prerequisits;
      console.log(preRequisites);
      if (preRequisites.length === 0) {
        return true;
      } else {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.prerequisitesId
        );
        return preRequisiteIds.every((id: string) => {
          completedCourseId.includes(id);
        }); //here "every is a js method which return true if all the values of a an array fullfil any specific condiion given using functions"
      }
    })
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentSemesterTakenCourse.find(
        (c: any) => c.OfferedCourseId === course.id
      );

      if (isAlreadyTakenCourse) {
        course.OfferedCourseSection.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.OfferedCourseSectionId) {
            section.isTaken = true; // here "isTaken" is a new property added now,which was not in schema model & database.
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true,
        };
      } else {
        course.OfferedCourseSection.map((section: any) => {
          section.isTaken = false;
        });
        return {
          ...course,
          isTaken: false,
        };
      }
    });

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
