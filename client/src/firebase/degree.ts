// client/src/firebase/degree.ts

import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

interface Course {
  code: string;
  title: string;
  credits: number;
}

export interface DegreeProgressData {
  completedCourses: Course[];
  remainingCoursesByDept: { [key: string]: Course[] };
  totalCredits: number;
  completedCredits: number;
}

export const getDegreeProgress = async (userId: string): Promise<DegreeProgressData> => {
  try {
    const userQuery = query(collection(db, "users"), where("customId", "==", userId));
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      throw new Error("User not found in database.");
    }
    const userData = userSnapshot.docs[0].data();
    const userUid = userSnapshot.docs[0].id;
    const curriculumId = userData.curriculumId;

    if (!curriculumId) {
      throw new Error("User data is missing 'curriculumId'.");
    }

    const curriculumRef = doc(db, "curriculums", curriculumId);
    const curriculumSnap = await getDoc(curriculumRef);
    if (!curriculumSnap.exists()) {
      throw new Error("Curriculum not found in database.");
    }
    const curriculumData = curriculumSnap.data();
    const totalCredits: number = curriculumData.totalCredits || 0;
    const requiredCourseCodes: string[] = curriculumData.requiredCourses || [];

    const courseDetailsMap = new Map<string, Course>();
    if (requiredCourseCodes.length > 0) {
      const coursesQuery = query(collection(db, "courses"));
      const coursesSnapshot = await getDocs(coursesQuery);
      coursesSnapshot.forEach((doc) => {
        const course = doc.data() as Course;
        courseDetailsMap.set(course.code, course);
      });
    }

    const enrollmentsRef = collection(db, "users", userUid, "enrollments");
    const enrollmentsSnap = await getDocs(enrollmentsRef);
    const completedCourseCodes = enrollmentsSnap.docs
      .map(doc => doc.data())
      .filter(enrollment => enrollment.grade !== 'IP' && enrollment.grade !== null)
      .map(enrollment => enrollment.courseId);

    const completedCourses: Course[] = completedCourseCodes
      .map(code => courseDetailsMap.get(code))
      .filter((course): course is Course => Boolean(course));

    const remainingCourseCodes = requiredCourseCodes.filter(
      (code) => !completedCourseCodes.includes(code)
    );

    const remainingCourses: Course[] = remainingCourseCodes
      .map(code => courseDetailsMap.get(code))
      .filter((course): course is Course => Boolean(course));

    const completedCredits = completedCourses.reduce(
      (total, course) => total + course.credits,
      0
    );

    const remainingCoursesByDept = remainingCourses.reduce((acc, course) => {
      const department = course.code.match(/^[a-zA-Z]+/)?.[0] || 'General';
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(course);
      return acc;
    }, {} as { [key: string]: Course[] });

    return {
      completedCourses,
      remainingCoursesByDept,
      totalCredits,
      completedCredits,
    };

  } catch (error) {
    console.error("Error fetching degree progress:", error);
    throw error;
  }
};