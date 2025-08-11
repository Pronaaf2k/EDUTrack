import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Ensure this path to your firebase config is correct

// Defines the structure for a single course
interface Course {
  code: string;
  title: string;
  credits: number;
}

// Defines the data structure that the component expects
export interface DegreeProgressData {
  completedCourses: Course[];
  remainingCourses: Course[];
  totalCredits: number;
  completedCredits: number;
}

// Fetches all the data and calculates progress
export const getDegreeProgress = async (userId: string): Promise<DegreeProgressData> => {
  try {
    // 1. Find the user in Firestore using their ID
    const userQuery = query(collection(db, "users"), where("customId", "==", userId));
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      throw new Error("User not found in database.");
    }
    const userData = userSnapshot.docs[0].data();
    const curriculumId = userData.curriculumId;
    const completedCourseCodes: string[] = userData.completedCourses || [];

    if (!curriculumId) {
      throw new Error("User data is missing 'curriculumId'.");
    }

    // 2. Get the curriculum (the user's degree plan)
    const curriculumRef = doc(db, "curriculums", curriculumId);
    const curriculumSnap = await getDoc(curriculumRef);
    if (!curriculumSnap.exists()) {
      throw new Error("Curriculum not found in database.");
    }
    const curriculumData = curriculumSnap.data();
    const totalCredits: number = curriculumData.totalCredits || 0;
    const requiredCourseCodes: string[] = curriculumData.requiredCourses || [];

    // 3. Get the details for all courses in the curriculum
    const courseDetailsMap = new Map<string, Course>();
    if (requiredCourseCodes.length > 0) {
      const coursesQuery = query(collection(db, "courses"), where("code", "in", requiredCourseCodes));
      const coursesSnapshot = await getDocs(coursesQuery);
      coursesSnapshot.forEach((doc) => {
        const course = doc.data() as Course;
        courseDetailsMap.set(course.code, course);
      });
    }

    // 4. Determine which courses are completed and which are remaining
    const remainingCourseCodes = requiredCourseCodes.filter(
      (code) => !completedCourseCodes.includes(code)
    );
    
    const completedCourses: Course[] = completedCourseCodes
      .map((code) => courseDetailsMap.get(code))
      .filter((course): course is Course => Boolean(course));

    const remainingCourses: Course[] = remainingCourseCodes
      .map((code) => courseDetailsMap.get(code))
      .filter((course): course is Course => Boolean(course));

    const completedCredits = completedCourses.reduce(
      (total, course) => total + course.credits,
      0
    );

    // 5. Return the final, calculated data object
    return {
      completedCourses,
      remainingCourses,
      totalCredits,
      completedCredits,
    };

  } catch (error) {
    console.error("Error fetching degree progress:", error);
    throw error; // This error will be caught by the useEffect in your page
  }
};